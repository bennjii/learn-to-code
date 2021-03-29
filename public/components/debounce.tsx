let lastDebounce = new Date();

const updateSync = (callback) => {
    lastDebounce = new Date();

    setTimeout(() => { 
      if(new Date().getTime() - lastDebounce.getTime() >= 2500) {
        lastDebounce = new Date();
        return callback();
      }
    }, 2500);
}

export { updateSync };