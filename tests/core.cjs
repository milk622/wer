const assert=require('node:assert/strict'),C=require('../core.js');let count=0;
function test(name,fn){fn();console.log('通过：'+name);count++;}
test('设备本地日期',()=>assert.equal(C.dateKey(new Date(2026,9,22,23,59)),'2026-10-22'));
test('月末、闰年、世纪边界',()=>{for(const s of ['2024-02-29','2000-02-29','2026-12-31'])assert(C.validDate(s));for(const s of ['2026-02-29','1900-02-29','2026-04-31','2026-13-01','__proto__'])assert(!C.validDate(s));});
test('连续200年月历边界及星期排列',()=>{for(let y=1900;y<2100;y++)for(let m=0;m<12;m++){const a=C.monthCells(y,m),days=a.filter(Boolean);assert.equal(a.length%7,0);assert.equal(days.length,new Date(y,m+1,0).getDate());assert.equal(a.indexOf(days[0]),(new Date(y,m,1).getDay()+6)%7);assert(days.every(C.validDate));}});
test('跨年跨月',()=>{assert.equal(C.dateKey(new Date(2026,12,1)),'2027-01-01');assert.equal(C.dateKey(new Date(2026,-1,1)),'2025-12-01');});
test('多部位单日计数、修改和删除',()=>{const d=C.empty();d.records['2026-10-22']=['胸部','三头'];d.records['2026-09-30']=['背部'];assert.deepEqual(C.counts(d,2026,9),{month:1,total:2});d.records['2026-10-22']=['腿部'];assert.equal(C.counts(d,2026,9).month,1);delete d.records['2026-10-22'];assert.equal(C.counts(d,2026,9).month,0);});
test('JSON往返及自定义项目',()=>{const d=C.empty();d.customProjects=['拉伸'];d.records['2024-02-29']=['拉伸','胸部'];assert.deepEqual(C.validate(JSON.parse(JSON.stringify(d))),d);});
test('拒绝无效备份',()=>{for(const v of [null,{},[],{...C.empty(),version:2},{...C.empty(),records:{'2026-02-29':['胸部']}},{...C.empty(),records:{'2026-10-22':[]}},{...C.empty(),records:{'2026-10-22':['未知']}},{...C.empty(),customProjects:['胸部']},{...C.empty(),customProjects:['拉伸','拉伸']},{...C.empty(),records:{'2026-10-22':['胸部','胸部']}}])assert.throws(()=>C.validate(v));});
console.log(count+'组核心测试通过');
