// Diagnostic adapter for the unmodified, pinned official spine-libgdx 3.6 runtime.
// It supplies atlas metadata without a GPU; all binary, animation and geometry
// evaluation remains in the official Java implementation, independent of local JS.
import java.io.*;
import java.util.*;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.TextureData;
import com.badlogic.gdx.graphics.g2d.TextureAtlas;
import com.badlogic.gdx.graphics.g2d.TextureAtlas.AtlasRegion;
import com.badlogic.gdx.utils.*;
import com.esotericsoftware.spine.*;
import com.esotericsoftware.spine.attachments.*;

public class DynamicSpine36Reference {
  static class MetadataTexture extends Texture {
    final int width,height;
    MetadataTexture(int w,int h){super(3553,0,(TextureData)java.lang.reflect.Proxy.newProxyInstance(TextureData.class.getClassLoader(),new Class[]{TextureData.class},(p,m,a)->m.getReturnType()==boolean.class?false:null));width=w;height=h;}
    public void load(TextureData data){} // No upload; this tool only evaluates CPU geometry.
    public int getWidth(){return width;}public int getHeight(){return height;}
  }
  static class Region extends AtlasRegion {
    float u0, v0, u1, v1;
    Region(TextureAtlas.TextureAtlasData.Region r,int imageWidth,int imageHeight) {
      super(new MetadataTexture(imageWidth,imageHeight),r.left,r.top,r.rotate?r.height:r.width,r.rotate?r.width:r.height);
      name=r.name; index=r.index; offsetX=r.offsetX; offsetY=r.offsetY;
      packedWidth=r.rotate?r.height:r.width; packedHeight=r.rotate?r.width:r.height; originalWidth=r.originalWidth; originalHeight=r.originalHeight;
      rotate=r.rotate; degrees=r.degrees;
      u0=(float)r.left/imageWidth; v0=(float)r.top/imageHeight;
      u1=(float)(r.left+(r.rotate?r.height:r.width))/imageWidth;
      v1=(float)(r.top+(r.rotate?r.width:r.height))/imageHeight;
    }
    public float getU(){return u0;} public float getV(){return v0;}
    public float getU2(){return u1;} public float getV2(){return v1;}
    public int getRegionWidth(){return packedWidth;} public int getRegionHeight(){return packedHeight;}
  }
  static class Loader implements AttachmentLoader {
    Map<String,Region> regions=new HashMap<>();
    Loader(String filename) {
      FileHandle file=new FileHandle(filename);
      Map<String,int[]> dimensions=new HashMap<>();
      for(TextureAtlas.TextureAtlasData.Region r:new TextureAtlas.TextureAtlasData(file,file.parent(),false).getRegions()) {
        String image=r.page.textureFile.path();int[] size=dimensions.get(image);
        if(size==null){try(DataInputStream input=new DataInputStream(r.page.textureFile.read())){if(input.readLong()!=0x89504e470d0a1a0aL)throw new IOException("Expected PNG: "+image);input.skipNBytes(8);size=new int[]{input.readInt(),input.readInt()};dimensions.put(image,size);}catch(IOException e){throw new RuntimeException(e);}}
        regions.putIfAbsent(r.name,new Region(r,size[0],size[1]));
      }
    }
    Region find(String p){Region r=regions.get(p);if(r==null)throw new IllegalArgumentException("Region not found in atlas: "+p);return r;}
    public RegionAttachment newRegionAttachment(Skin s,String n,String p){RegionAttachment a=new RegionAttachment(n);a.setRegion(find(p));return a;}
    public MeshAttachment newMeshAttachment(Skin s,String n,String p){MeshAttachment a=new MeshAttachment(n);a.setRegion(find(p));return a;}
    public BoundingBoxAttachment newBoundingBoxAttachment(Skin s,String n){return new BoundingBoxAttachment(n);}
    public ClippingAttachment newClippingAttachment(Skin s,String n){return new ClippingAttachment(n);}
    public PathAttachment newPathAttachment(Skin s,String n){return new PathAttachment(n);}
    public PointAttachment newPointAttachment(Skin s,String n){return new PointAttachment(n);}
  }
  static Map<String,Object> obj(Object... kv){Map<String,Object> m=new LinkedHashMap<>();for(int i=0;i<kv.length;i+=2)m.put((String)kv[i],kv[i+1]);return m;}
  static String encode(Object v){
    if(v==null)return "null";
    if(v instanceof String){Json codec=new Json();codec.setOutputType(JsonWriter.OutputType.json);return codec.toJson(v,String.class);}
    if(v instanceof Number||v instanceof Boolean)return v.toString();
    StringJoiner j;
    if(v instanceof Map){j=new StringJoiner(",","{","}");for(Object item:((Map<?,?>)v).entrySet()){Map.Entry<?,?> e=(Map.Entry<?,?>)item;j.add(encode(e.getKey())+":"+encode(e.getValue()));}return j.toString();}
    j=new StringJoiner(",","[","]");
    if(v instanceof Iterable)for(Object item:(Iterable<?>)v)j.add(encode(item));
    else if(v.getClass().isArray())for(int i=0;i<java.lang.reflect.Array.getLength(v);i++)j.add(encode(java.lang.reflect.Array.get(v,i)));
    else throw new IllegalArgumentException("Unsupported JSON: "+v.getClass());
    return j.toString();
  }
  static Object inspect(JsonValue request) {
    String file=request.getString("file"),atlas=request.getString("atlas");
    try {
      SkeletonData data=new SkeletonBinary(new Loader(atlas)).readSkeletonData(new FileHandle(file));
      List<Object> animations=new ArrayList<>();for(Animation a:data.getAnimations())animations.add(obj("name",a.getName(),"duration",a.getDuration()));
      String animation=request.getString("animation",null);if(animation==null||data.findAnimation(animation)==null)animation=data.getAnimations().size>0?data.getAnimations().first().getName():null;
      List<Object> samples=new ArrayList<>();
      for(float t:new float[]{0,1f/30f,.25f,.5f,1f}) {
        Skeleton skeleton=new Skeleton(data);AnimationState state=new AnimationState(new AnimationStateData(data));
        if(animation!=null){state.setAnimation(0,animation,true);state.update(t);state.apply(skeleton);}skeleton.updateWorldTransform();
        List<Object> slots=new ArrayList<>();
        for(Slot slot:skeleton.getSlots()){
          Attachment a=slot.getAttachment();if(a==null)continue;
          float[] v=null,uv=null;
          if(a instanceof RegionAttachment){v=new float[8];((RegionAttachment)a).computeWorldVertices(slot.getBone(),v,0,2);uv=((RegionAttachment)a).getUVs();}
          else if(a instanceof MeshAttachment){MeshAttachment m=(MeshAttachment)a;v=new float[m.getWorldVerticesLength()];m.computeWorldVertices(slot,0,v.length,v,0,2);uv=m.getUVs();}
          else if(a instanceof ClippingAttachment){ClippingAttachment c=(ClippingAttachment)a;v=new float[c.getWorldVerticesLength()];c.computeWorldVertices(slot,0,v.length,v,0,2);}
          if(v!=null){for(float n:v)if(!Float.isFinite(n))throw new IllegalStateException("Non-finite vertex: "+slot.getData().getName()+" at "+t);Map<String,Object> row=obj("slot",slot.getData().getName(),"attachment",a.getName(),"kind",a.getClass().getSimpleName(),"vertices",v,"uv",uv);if(request.getBoolean("details",false)&&a instanceof VertexAttachment){row.put("deform",slot.getAttachmentVertices().toArray());row.put("setup",((VertexAttachment)a).getVertices());}slots.add(row);}
        }
        List<Object> bones=new ArrayList<>();
        if(request.getBoolean("details",false))for(Bone b:skeleton.getBones())bones.add(obj("name",b.getData().getName(),"local",new float[]{b.getX(),b.getY(),b.getRotation(),b.getScaleX(),b.getScaleY(),b.getShearX(),b.getShearY()},"world",new float[]{b.getA(),b.getB(),b.getC(),b.getD(),b.getWorldX(),b.getWorldY()}));
        samples.add(obj("time",t,"slots",slots,"bones",bones));
      }
      return obj("file",file,"status","decoded","version",data.getVersion(),"bones",data.getBones().size,"slots",data.getSlots().size,"skins",data.getSkins().size,"animations",animations,"animation",animation,"samples",samples);
    }catch(Throwable e){return obj("file",file,"status","failed","error",e.toString(),"cause",e.getCause()==null?null:e.getCause().toString());}
  }
  public static void main(String[] args)throws Exception {
    System.setOut(new PrintStream(System.out,true,"UTF-8"));
    JsonValue requests=new JsonReader().parse(new FileHandle(args[0]));
    for(JsonValue r=requests.child;r!=null;r=r.next){System.out.println(encode(inspect(r)));System.out.flush();}
  }
}
