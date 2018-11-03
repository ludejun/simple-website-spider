var http = require('http');
var fs = require('fs');
var url = require('url');
var process = require('child_process');

// 创建服务器
http.createServer( function (request, response) {  
   // 解析请求，包括文件名
   var pathname = url.parse(request.url).pathname;

   // 输出请求的文件名
   console.log("Request for " + pathname + " received.");

   if (pathname.indexOf('/api') === 0) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      // 解析 url 参数
      var params = url.parse(request.url, true).query;

      var data = getSearchResult(params.pname, params.cardNum, params.j_captcha);
      response.write('hello world');
      //  发送响应数据
      response.end();
   } else {
      // 从文件系统中读取请求的文件内容
      fs.readFile(pathname.substr(1), function (err, data) {
         if (err) {
            console.log(err);
            // HTTP 状态码: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
         }else{             
            // HTTP 状态码: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {'Content-Type': 'text/html'});    
            
            // 响应文件内容
            response.write(data.toString());
         }
         //  发送响应数据
         response.end();
      });
   }
}).listen(3001);

function getSearchResult(pname, cardNum, j_captcha) {
  var data = {
    'searchCourtName': '全国法院（包含地方各级法院）',
    'selectCourtId': 1,
    'selectCourtArrange': 1,
    'pname': pname,
    'cardNum': cardNum,
    'j_captcha': j_captcha,
    'countNameSelect': '',
    'captchaId': '802007c8f98b4d1c8c55dd02d4edd07b'
  };

  var urlString = "'http://zxgk.court.gov.cn/zhzxgk/newsearch' -H 'Origin: null' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,fr;q=0.5' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: */*' -H 'Connection: keep-alive' --data 'searchCourtName=%E5%85%A8%E5%9B%BD%E6%B3%95%E9%99%A2%EF%BC%88%E5%8C%85%E5%90%AB%E5%9C%B0%E6%96%B9%E5%90%84%E7%BA%A7%E6%B3%95%E9%99%A2%EF%BC%89&selectCourtId=1&selectCourtArrange=1&pname=%E9%9D%B3%E8%BE%BE%E5%AE%BE&cardNum=440506199012181717&j_captcha=t3ar&countNameSelect=&captchaId=802007c8f98b4d1c8c55dd02d4edd07b' --compressed";

  process.exec("curl "+urlString, function(err, stdout, stderr) {
   console.log(stdout);
  })
}
 
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:3001/');