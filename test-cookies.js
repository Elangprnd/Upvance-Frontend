const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  const cookies = res.headers['set-cookie'];
  if (cookies) {
    console.log(`Found ${cookies.length} cookies`);
    let totalSize = 0;
    cookies.forEach((c, i) => {
      console.log(`Cookie ${i}: ${c.substring(0, 50)}... (size: ${c.length})`);
      totalSize += c.length;
    });
    console.log(`Total cookie size from login: ${totalSize} bytes`);
  } else {
    console.log('No set-cookie header');
  }
  
  // Also try fetching /api/events with those cookies
  if (cookies) {
    const rawCookies = cookies.map(c => c.split(';')[0]).join('; ');
    console.log(`\nNow fetching /api/events with Cookie header size: ${rawCookies.length} bytes`);
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/events',
      method: 'GET',
      headers: {
        'Cookie': rawCookies
      }
    }, (res2) => {
      console.log('Events Status Code:', res2.statusCode);
      const cookies2 = res2.headers['set-cookie'];
      if (cookies2) {
        console.log(`Events returned ${cookies2.length} set-cookie headers`);
      }
    });
    req2.end();
  }
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(JSON.stringify({ email: 'test@upvance.com', password: 'password123' }));
req.end();
