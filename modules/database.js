function noop(obj){};

class Document{
  constructor(name, keyPath, uniqueIndices=[], indices =[]){
    this.name = name;
    this.keyPath = keyPath;
    this.uniqueIndices = uniqueIndices;
    this.indices = indices;
  }

  create(options = {}){
    const result = {};
    if(options[this.keyPath] == undefined){
      throw new Error("Cannot create a new document without the appropriate keypath: ",this.keyPath);
    }
    result[this.keyPath] = options[this.keyPath];
    for(let key of this.uniqueIndices){
      if(options[key] == undefined){
        throw new Error("Cannot create a new document without specifying unique key(s): ", this.uniqueIndices);
      }
      result[key] = options[key];
    }
    for(let key of this.indices){
      result[key] = options[key] || null;
    }

    result.keyPath = this.keyPath;

    return result;
  }
}

class Folder{
  constructor(name, version,documents){
    this.name = name;
    this.version = version;
    this.documents = documents;
    this.db = {};
    this.request = {};
  }

  build(callback=noop){
    this.request = indexedDB.open(this.name, this.version);
    this.request.onerror = this.error.bind(this);
    this.request.onsuccess = (event)=>{
      this.success(event);
      callback(this);
    };
    this.request.onupgradeneeded = (event)=>{
      this.upgrade(event);
      callback(this);
    }
  }
  error(event){
    console.warn("Error: ",event.message, this);
  }

  success(event){
    this.db = event.target.result;
  }

  upgrade(event){
    this.db = event.target.result;
    for(let doc of this.documents){
      console.log(doc);
      const folder = this.db.createObjectStore(doc.name,{keyPath:doc.keyPath});
      for(let name of doc.uniqueIndices){
        folder.createIndex(name,name, {unique:true});
      }
      for(let name of doc.indices){
        folder.createIndex(name,name,{unique:false});
      }
    }
  }

  checkState(){
    if(this.request.readyState!="done"){
      throw new Error("Cannot call on database prior to database being ready");
    }
  }

  getNewObjectStore(name,callback=noop){
    this.transaction = this.db.transaction([name],"readwrite");
    this.transaction.oncomplete = (event)=>{
      console.log("transaction succussful", this.name);
//      this.transaction = {};
      callback();
    }
    this.transaction.onerror = (event)=>{
      console.warn("Failed transaction: ", name, event);
      if(event.target.error.name == "ConstraintError"){
        console.log("Entry with that name already exists");
      }
      callback();
    }
    const objStore = this.transaction.objectStore(name);
    return objStore;
  }

  insert(file,type,callback=noop){
    this.checkState();
    const objStore = this.getNewObjectStore(type,callback);
    objStore.add(file);
    objStore.onsuccess = (event)=>{
      console.log("objStore.add successful", file, type);
      callback(this);
    }
    objStore.onerror = (event)=>{
      console.log("Failed to add() file: ", file, type, event);
    }
  }

  get(keypath, type, callback=noop){
    this.checkState();
    const objStore = this.getNewObjectStore(type,callback);
    objStore.get(keypath).onsuccess = callback;
  }

  update(file, type, callback=noop){
    this.checkState();
    const objStore = this.getNewObjectStore(type,callback);
    objStore.put(file);
    objStore.onsuccess = (event)=>{
      console.log("objStore.add successful", file, type);
      callback(this);
    }
    objStore.onerror =(event)=>{
      console.log("Failed to update() file: ", file, type, event);
    }
  }

  delete(file,type, callback=noop){
    this.checkState();
    const objStore = this.getNewObjectStore(type);
    objStore.delete(file.name);
    callback(this);
  }

}
/*Testing
let d1 = new Document("Users", "name", ["email"], ["settings","pages"]);
let d1_instance = d1.create({name:"Chris Person-Rennell", email:"cpersonrennell@gmail.com"});
console.log(d1_instance);
let d2 = new Document("Settings", "user", [], ["speech_volume", "speech_voice", "prompt_volume", "prompt_voice", "speech_delay"]);
let d3 = new Document("Pages", "user", [], ["name","layout","description", "buttons"]);
let d4 = new Document("Gamepad", "user",[],["name", "buttons"])
let folder = new Folder("AAC Application", 1,[d1, d2, d3]);
folder.build(()=>{
  folder.insert(d1_instance,"Users");

});
function initializeDB(schema){
  const request = indexedDB.open(schema.name,schema.version);

  request.onerror=(event)=>{
    console.error("Could not use IndexedDB");
  }

  request.onsuccess=(event)=>{
    schema.db = event.target.result;
    schema.callback();
  }

  request.onupgradeneeded=(event)=>{
    schema.db = event.target.result;
    console.log("on upgrade needed");
    schema.db.createObjectStore("Users",{keyPath:"name"});
    schema.db.createObjectStore("Pages", {keyPath: "name"});
    schema.db.createObjectStore("KeyMappings",{keyPath:"name"});

    /*for(let store of schema.objects){
      try{
        schema.db.createObjectStore(store, {autoIncrement:true});
      }catch(err){console.warn(err);}
    } 
  }
}
*/
export {Folder, Document}
