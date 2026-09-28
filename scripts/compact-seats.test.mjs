import assert from 'node:assert/strict';
import test from 'node:test';
import { compactSeatGeometry } from '../apps/core/noname/ui/compactSeats.js';

test('reference templates preserve exact rows and seat order', () => {
 const eight = compactSeatGeometry(1920,1080,8);
 assert.deepEqual(eight.seats.map(p=>p.y), [715.2,220,80,12,12,12,80,220]);
 const five = compactSeatGeometry(1920,1080,5);
 assert.deepEqual(five.seats.map(p=>p.y), [715.2,220,12,12,220]);
 assert.equal(five.seats[1].x,eight.seats[1].x);
 assert.equal(five.seats[2].x,eight.seats[3].x);
 assert.equal(five.seats[3].x,eight.seats[5].x);
 assert.equal(five.seats[4].x,eight.seats[7].x);
 assert.equal(eight.cardScale*150,270);
 assert(Math.abs(eight.cardScale*150/eight.playerHeight-.7653)<.001);
});
test('landlord and both farmer perspectives follow the reference slots', () => {
 const landlord = compactSeatGeometry(1920,1080,3,{mode:'doudizhu',landlordPosition:0});
 assert.deepEqual(landlord.seats.map(p=>p.y),[715.2,12,12]);
 const third = compactSeatGeometry(1920,1080,3,{mode:'doudizhu',landlordPosition:1});
 assert.deepEqual(third.seats.map(p=>p.y),[715.2,12,220]);
 assert.equal(third.seats[1].x,landlord.seats[1].x);
 assert.equal(third.seats[2].x,16);
 const second = compactSeatGeometry(1920,1080,3,{mode:'doudizhu',landlordPosition:2});
 assert.deepEqual(second.seats.map(p=>p.y),[715.2,220,12]);
 assert.equal(second.seats[2].x,landlord.seats[2].x);
});
test('continuous resizing keeps frames inside and never intersects seats', () => {
 for(const [width,height] of [[1920,1080],[1920,860],[1366,768],[900,650],[800,450],[390,844],[3840,1080]]) {
  for(const count of [2,3,4,5,6,7,8,10,12,16]) {
   const g=compactSeatGeometry(width,height,count);
   for(const [i,a]of g.seats.entries()) {
    assert(a.x>=0&&a.y>=0&&a.x+g.playerWidth<=width+.001&&a.y+g.playerHeight<=height+.001);
    for(const b of g.seats.slice(i+1))assert(a.x+g.playerWidth<=b.x||b.x+g.playerWidth<=a.x||a.y+g.playerHeight<=b.y||b.y+g.playerHeight<=a.y);
   }
   const next=compactSeatGeometry(width+1,height+1,count);
   for(let i=0;i<count;i++)assert(Math.abs(next.seats[i].x-g.seats[i].x)<2&&Math.abs(next.seats[i].y-g.seats[i].y)<2);
  }
 }
});
