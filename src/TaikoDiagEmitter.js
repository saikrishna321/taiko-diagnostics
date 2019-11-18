import EventEmitter from 'events';

class TaikoDiagEmitter extends EventEmitter {
  emitObject(event, obj = {}) {
    this.emit(event, obj);
    return obj;
  }
}

export default TaikoDiagEmitter;
