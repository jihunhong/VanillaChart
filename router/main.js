module.exports = function(app)
{
    app.get('/', function(req, res){
        res.render("index",{
            name : '지훈'
          })
    })

}