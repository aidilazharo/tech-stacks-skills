import {migrate,client} from './database';migrate().then(()=>client.close()).catch(error=>{console.error(error);process.exitCode=1;});
