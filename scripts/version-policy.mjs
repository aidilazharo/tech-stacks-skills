const VERSION=/^(0|[1-9][0-9]?)\.(0|[1-9][0-9]?)\.(0|[1-9][0-9]?)$/;
// Runtime-safe copy of the source-only .memory/versioning.json policy.
const policy=Object.freeze({schema:1,initialVersion:'0.0.0',maxVersion:'99.99.99'});
export function parts(value){
 if(typeof value!=='string'||!VERSION.test(value))throw Error('Version must be canonical MAJOR.MINOR.PATCH in 0..99.');
 const n=value.split('.').map(Number);if(n.some(x=>x>99))throw Error('Version exceeds 99.99.99.');return n;
}
export function nextVersion(value){
 const [a,b,c]=parts(value);
 if(policy.schema!==1||policy.maxVersion!=='99.99.99'||policy.initialVersion!=='0.0.0')throw Error('Invalid version policy memory.');
 if(a===99&&b===99&&c===99)throw Error('Maximum version 99.99.99 reached.');
 return c<99?[a,b,c+1].join('.'):b<99?[a,b+1,0].join('.'):[a+1,0,0].join('.');
}
export function requireIncrement(previous,next){
 const expected=nextVersion(previous);if(next!==expected)throw Error('Version must increment from '+previous+' to '+expected+'.');return next;
}
