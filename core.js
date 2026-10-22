(function(root){
  'use strict';
  const presets=['胸部','背部','腿部','肩部','二头','三头','腹部','有氧'];
  const key='fit-calendar.data.v1';
  const empty=()=>({app:'fit-calendar',version:1,records:{},customProjects:[]});
  const dateKey=d=>`${String(d.getFullYear()).padStart(4,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);return y>=1900&&y<=9999&&m>=1&&m<=12&&d>=1&&d<=new Date(y,m,0).getDate();}
  function names(a,max){if(!Array.isArray(a)||a.length>max||a.some(x=>typeof x!=='string'||!x.trim()||x!==x.trim()||x.length>20||/[\x00-\x1f]/.test(x))||new Set(a).size!==a.length)throw Error('训练项目格式无效');return [...a];}
  function validate(data){if(!data||typeof data!=='object'||data.app!=='fit-calendar'||data.version!==1||!data.records||Array.isArray(data.records)||typeof data.records!=='object')throw Error('不是有效的健身日历备份（版本1）');const result=empty();result.customProjects=names(data.customProjects,100);if(result.customProjects.some(x=>presets.includes(x)))throw Error('自定义项目与预设重复');const entries=Object.entries(data.records);if(entries.length>100000)throw Error('记录过多');for(const [date,items]of entries){if(!validDate(date))throw Error('备份包含无效日期');const list=names(items,108);if(!list.length||list.some(x=>!presets.includes(x)&&!result.customProjects.includes(x)))throw Error('备份包含未知或空训练项目');result.records[date]=list;}return result;}
  function monthCells(y,m){const offset=(new Date(y,m,1).getDay()+6)%7;const count=new Date(y,m+1,0).getDate();return Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>i>=offset&&i<offset+count?dateKey(new Date(y,m,i-offset+1)):null);}
  function counts(data,y,m){const prefix=`${y}-${String(m+1).padStart(2,'0')}-`;const dates=Object.keys(data.records);return {month:dates.filter(x=>x.startsWith(prefix)).length,total:dates.length};}
  const api={presets,key,empty,dateKey,validDate,validate,monthCells,counts};root.FitCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
