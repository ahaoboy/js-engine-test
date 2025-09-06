var now = Date.now()
Object.keys(obj).map(function cb(i){
  return obj[i]
});
print(Date.now() - now)