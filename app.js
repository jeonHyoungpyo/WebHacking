const express = require('express'),
      app = express(),
      httpport = 3000, //test port 추후 80이용
      httpsport = 443, //https port
      nunjucks = require('nunjucks'),
      logger = require('morgan'), //로그 미들웨어
      bodyParser = require('body-parser'), 
      models =require('./models/index.js'),
      cookieParser = require('cookie-parser'),
      accounts = require('./routes/accounts'),
      auth = require('./routes/auth'),
      loginRequired = require('./helpers/loginRequired'),
      home = require('./routes/home'),
      chat = require('./routes/chat'),
      request = require('request'),
      controllers = require('./controllers/products/index');
     
      
      
      
      
    
     
    
    

      nunjucks.configure('template',{
          autoescape:true,
          express:app
      });


//flash 메시지 관련 모듈    
const flash = require('connect-flash');

//passport 로그인 관련
const passport = require('passport'),
      session = require('express-session');

//라우팅
let admin = require('./routes/admin.js');




const fs = require('fs');

//미들웨어 셋팅
app.use(logger('dev'));
app.use(logger('combined',{stream:fs.WriteStream('./serverlog.log')}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.locals.req_path = request.path;











//db session 관련 셋팅
const db = require('./models');

const Sequelize = require('sequelize'),
      SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionMiddleWare = session({
    secret: 'webhack',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new SequelizeStore({
        db: db.sequelize
    }),
});
app.use(sessionMiddleWare);


/*Db 세션으로 바꿈
//session 관련 셋팅
app.use(session({
    secret : 'webhack',
    resave: false,
    saveUninitialized : true,
    cookie : {
        maxAge: 2000 * 60 * 60 //지속시간 2시간 설정
    }
}));
*/


//passport 적용
app.use(passport.initialize()); //passport를 미들웨어로 장착
app.use(passport.session()); //passport가 session을 사용할 수 있도록 하는 미들웨어


//플래시 메시지 관련
app.use(flash());


//네비게이션,메뉴바
app.use((req,res,next)=>{
    //app.locals.myname ="nodejs";
    app.locals.isLogin = req.isAuthenticated();
    //app.locals.urlparameter =req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});





//get - 웹 브라우저에서 url을 입력 시 응답하는 부분
app.use('/admin',admin);

//회원가입 페이지
app.use('/accounts',accounts);

//home 화면
app.use('/',home);

//chat 화면
app.use('/chat',chat);


//페이스북 로그인
app.use('/auth', auth);


//상세보기 페이지
app.use('/products',controllers);




//sync() 메서드를 호출하여 models 폴더에서 정의된 모델들을 바탕으로 실제로 Model을 등록

models.sequelize.sync().then( () =>{
    console.log("DB 연결 성공");
}).catch(err =>{
    console.log("연결실패");
    console.log(err);
});


//테이블 생성시 싱크해주기 위해서 한번 실행
//  return models.sequelize.sync();




//잘못된 접근 + 500 오류 구현하기

const server =app.listen(httpport,()=>{
    console.log('Express listening on port',httpport);
       });

//listen
const listen = require('socket.io'),
      io = listen(server);
io.use((socket,next)=>{
    sessionMiddleWare(socket.request,socket.request.res,next);
});
      require('./helpers/socketConnection')(io);

/*
 const server =app.listen(httpport,()=>{
 console.log('Express listening on port',httpport);
    });
    
 const listen = require('socket.io'),
          io =listen(server);
    
 io.on('connection',(socket)=>{
        console.log('소켓 작동');
        socket.on('client mesaage',(data)=>{
            console.log(data);
            io.emit('Server message',data.message);
        
        });
     });
    */