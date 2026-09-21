import JSZip from 'jszip';

export const MAX_PROVIDER_BYTES=3*1024*1024*1024;
export const MAX_PROVIDER_FILES=24000;
const encoder=new TextEncoder(),decoder=new TextDecoder();
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);return n>>>0;});
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=(crc>>>8)^crcTable[(crc^byte)&255];return (crc^0xffffffff)>>>0;}
function header(size){const bytes=new Uint8Array(size);return {bytes,view:new DataView(bytes.buffer)};}

/** Blob-backed ZIP writer. Does not concatenate several GB into a JS string. */
export async function writeLargeArchive(paths,read){
 const parts=[],central=[];let offset=0,total=0;
 for(const path of paths){
  const blob=await read(path),bytes=new Uint8Array(await blob.arrayBuffer()),name=encoder.encode(path),crc=crc32(bytes);
  total+=bytes.length;if(total>MAX_PROVIDER_BYTES||paths.length>MAX_PROVIDER_FILES)throw new Error('套装超过 3 GB 或文件数量上限');
  const local=header(30+name.length),lv=local.view;
  lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x800,true);lv.setUint32(14,crc,true);lv.setUint32(18,bytes.length,true);lv.setUint32(22,bytes.length,true);lv.setUint16(26,name.length,true);local.bytes.set(name,30);
  const entry=header(46+name.length),ev=entry.view;
  ev.setUint32(0,0x02014b50,true);ev.setUint16(4,20,true);ev.setUint16(6,20,true);ev.setUint16(8,0x800,true);ev.setUint32(16,crc,true);ev.setUint32(20,bytes.length,true);ev.setUint32(24,bytes.length,true);ev.setUint16(28,name.length,true);ev.setUint32(42,offset,true);entry.bytes.set(name,46);
  parts.push(local.bytes,blob);central.push(entry.bytes);offset+=local.bytes.length+bytes.length;
 }
 const size=central.reduce((sum,b)=>sum+b.length,0),end=header(22);
 end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,central.length,true);end.view.setUint16(10,central.length,true);end.view.setUint32(12,size,true);end.view.setUint32(16,offset,true);
 return new Blob([...parts,...central,end.bytes],{type:'application/zip'});
}

/** Read only ZIP metadata and requested assets, never all provider artwork. */
export async function openLargeArchive(file){
 if(file.size>MAX_PROVIDER_BYTES+16*1024*1024)throw new Error('压缩包不能超过 3 GB');
 const tail=new Uint8Array(await file.slice(Math.max(0,file.size-65557)).arrayBuffer());
 const tv=new DataView(tail.buffer);let end=-1;
 for(let i=tail.length-22;i>=0;i--)if(tv.getUint32(i,true)===0x06054b50&&i+22+tv.getUint16(i+20,true)===tail.length){end=i;break;}
 if(end<0)throw new Error('无效的 ZIP 文件');
 const count=tv.getUint16(end+10,true),length=tv.getUint32(end+12,true),start=tv.getUint32(end+16,true);
 if(tv.getUint16(end+4,true)||tv.getUint16(end+6,true)||count>MAX_PROVIDER_FILES||length>16*1024*1024||start+length>file.size)throw new Error('不支持的 ZIP 文件结构');
 const data=new Uint8Array(await file.slice(start,start+length).arrayBuffer()),view=new DataView(data.buffer),entries=new Map();
 let offset=0,total=0;
 for(let n=0;n<count;n++){
  if(offset+46>data.length||view.getUint32(offset,true)!==0x02014b50)throw new Error('损坏的 ZIP 目录');
  const nameLength=view.getUint16(offset+28,true),extra=view.getUint16(offset+30,true),comment=view.getUint16(offset+32,true),end=offset+46+nameLength+extra+comment;
  if(end>data.length)throw new Error('损坏的 ZIP 文件名');
  const name=decoder.decode(data.subarray(offset+46,offset+46+nameLength)),size=view.getUint32(offset+24,true),compressed=view.getUint32(offset+20,true),position=view.getUint32(offset+42,true),method=view.getUint16(offset+10,true);
  if(entries.has(name)||/^[\/\\]|[\\\0:]/.test(name)||name.split('/').some(p=>p==='..'||p==='.')||(view.getUint16(offset+8,true)&1))throw new Error('压缩包包含非法路径、重复项或加密文件');
  total+=size;if(total>MAX_PROVIDER_BYTES)throw new Error('解压后的套装超过 3 GB');
  entries.set(name,{name,size,compressed,position,method,dir:name.endsWith('/'),central:data.slice(offset,end)});offset=end;
 }
 return {entries,total,async read(name,limit){
  const entry=entries.get(name);if(!entry||entry.dir)throw new Error('套装缺少文件：'+name);if(entry.size>limit||entry.compressed>limit+1024*1024)throw new Error('套装文件过大：'+name);
  const local=new DataView(await file.slice(entry.position,entry.position+30).arrayBuffer());if(local.byteLength!==30||local.getUint32(0,true)!==0x04034b50)throw new Error('损坏的 ZIP 文件头');
  const dataStart=entry.position+30+local.getUint16(26,true)+local.getUint16(28,true);if(dataStart+entry.compressed>start)throw new Error('损坏的 ZIP 文件范围');
  if(entry.method===0){if(entry.size!==entry.compressed)throw new Error('损坏的 ZIP 文件大小');return file.slice(dataStart,dataStart+entry.size);}
  if(entry.method!==8)throw new Error('不支持的压缩算法');
  // JSZip only receives this bounded single entry when decompression is needed.
  const central=entry.central.slice(),cv=new DataView(central.buffer);cv.setUint32(42,0,true);
  const localBlob=file.slice(entry.position,dataStart+entry.compressed),end=header(22);end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,1,true);end.view.setUint16(10,1,true);end.view.setUint32(12,central.length,true);end.view.setUint32(16,localBlob.size,true);
  const zip=new JSZip();zip.load(await new Blob([localBlob,central,end.bytes]).arrayBuffer());return new Blob([zip.file(name).asArrayBuffer()]);
 }};
}
