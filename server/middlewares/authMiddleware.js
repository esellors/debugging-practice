module.exports = {
   usersOnly: (req, res, next) => {
      console.log('user auth hit')
      if (!req.session.user) {
         return res.status(401).json({message: 'Please log in.'})
      }
      next();
   },
   adminsOnly: (req, res, next) => {
      console.log('admin auth hit')
      console.log(req.session.user.isAdmin)
      if (!req.session.user.isAdmin) {
         return res.status(403).json({message: 'You are not an admin.'})
      }
      next();
   }
}