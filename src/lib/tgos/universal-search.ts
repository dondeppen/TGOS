import { buildTgosObjects } from './object-framework';

export type SearchResult={id:string;type:string;title:string;subtitle:string;score:number;summary:string};

export function universalSearch(query:string):SearchResult[]{const q=query.trim().toLowerCase();if(!q)return[];return buildTgosObjects().map(o=>{const hay=[o.label,o.subtitle,o.summary,o.type,...o.capabilities].join(' ').toLowerCase();let score=0;if(o.label.toLowerCase().includes(q))score+=100;if(o.subtitle.toLowerCase().includes(q))score+=40;if(hay.includes(q))score+=20;score+=o.relationships.filter(r=>r.label.toLowerCase().includes(q)).length*10;return{id:o.id,type:o.type,title:o.label,subtitle:o.subtitle,summary:o.summary,score};}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score);} 

export const searchSuggestions=['Arxada','ReliaSource','Karschner','Xerox C9000','Canon 529iF','Melanie','Williamsport','SSA','Repair DNA','Digital Twin','Invoice','Fuser','010-341'];