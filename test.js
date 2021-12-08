User.findByIdAndUpdate(playerId, { $push: { gameLog: result }, $set: { successRate: findSimilarTypes() } }, (err, noSeQUe) => {
  if (err) {
    res.send(err);
  } else {
    noSeQUe.findSimilarTypes();
    res.send(result);
  }
});
});
