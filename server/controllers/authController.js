const bcrypt = require('bcryptjs');

module.exports = {
   register: async (req, res) => {
      const {username, password, isAdmin} = req.body;
      const db = req.app.get('db');
      const result = await db.get_user(username);
      const existingUser = result[0];

      if (existingUser) {
         res.status(409).json({message: 'Username taken'});
      } else {
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);

         const registeredUser = await db.register_user(isAdmin, username, hash);
         const user = registeredUser[0];

         req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
         }
         res.status(201).json(req.session.user);
      }
   },
   login: async (req, res) => {
      const {username, password} = req.body;
      const db = req.app.get('db');

      const foundUser = await db.get_user(username);
      const user = foundUser[0]

      if (!user) {
         return res.status(401).json({message: 'User not found. Please register as a new user.'})
      } 
      
      const isAuthenticated = bcrypt.compareSync(password, user.hash)

      if (!isAuthenticated) {
         return res.status(403).json({message: 'Password incorrect. Try again.'})
      }

      req.session.user = {
         isAdmin: user.is_admin,
         id: user.id,
         username: user.username
      }

      res.status(200).json(req.session.user);
   },
   logout: async (req, res) => {
      req.session.destroy();
      res.sendStatus(200);
   }
}