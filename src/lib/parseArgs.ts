import { parse } from "https://deno.land/std/flags/mod.ts";

class Opts {
    stringOnce?: string[];
    stringMany?: string[];
    boolean?: string[]
}

export function parseArgs(args: string[], optsDef?: Opts): any {
    let opts:any = {
        stopEarly: true,
        unknown: (v:string) => { 
            if (v.startsWith("-")) {
                throw "ERROR: Unknown option - " + v;
            }

            return true;
        }        
    }

    if (optsDef?.stringOnce || optsDef?.stringMany) {
        opts.string = [];
        if (optsDef?.stringOnce) {
            optsDef.stringOnce.forEach((v) => {
                opts.string.push(v);
            })
        }
        if (optsDef?.stringMany) {
            optsDef.stringMany.forEach((v) => {
                opts.string.push(v);
            })
        }
    }

    if (optsDef?.boolean) {
        opts.boolean = optsDef?.boolean;
    }

    let myArgs = parse(args, opts);

    if (optsDef?.stringOnce) {
        optsDef.stringOnce.forEach((key) => {
            if (typeof(myArgs[key]) != "string") {
                throw `Option ${key} is for single use only`;
            }
        })
    }
    
    if (optsDef?.stringMany) {
        optsDef.stringMany.forEach((key) => {
            if (typeof(myArgs[key]) == "string") {
                myArgs[key] = [ myArgs[key] ];
            }
        })
    }

    return myArgs;
}