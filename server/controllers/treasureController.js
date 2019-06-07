module.exports = {
   dragonTreasure: async (req, res) => {
      console.log('hit')
      const treasure = await req.app.get('db').get_dragon_treasure(1);
      console.log(treasure)
      res.status(200).send(treasure);
   },
   getUserTreasure: async (req, res) => {
      console.log('hit')
      const treasure = await req.app.get('db').get_user_treasure(req.session.user.id);
      res.status(200).send(treasure);
   }
}