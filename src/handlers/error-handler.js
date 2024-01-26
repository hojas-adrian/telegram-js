export default (err) => {
  const ctx = err.ctx;
  console.error(`error al manejar ${ctx.update.update_id}\n ${err}`);
};
