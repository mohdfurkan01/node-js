//URL => Uniform Resource Locator

//https://www.mohdfurkan.dev/

//https=> protocol
//www.mohdfurkan.dev => domain name -> user friendly name of IP Address of my sever

// (/ ->ye path h w which means root path)
//(/about -> ye bhi path h)
//(/about/detail -> ye nested path h)

//query parameters => extra information jo ham pass kar sakte hain url k sath
//- ? question mark k bad jo bhi parameter ata h usko query kate hain

//mohdfurkan.dev/about?userId=1&a=2

//for query parameter checking
//http://localhost:8000/about?myname=furkan&userId=1
//http://localhost:8000/about?myname=furkan&userId=1&search=cat

//npm i url

//iska use index.js me kiya h

//log will look like this
// Url {
//     protocol: null,
//     slashes: null,
//     auth: null,
//     host: null,
//     port: null,
//     hostname: null,
//     hash: null,
//     search: '?myname=hamza&id=99&address=bareilly&country=india',
//     query: [Object: null prototype] {
//       myname: 'hamza',
//       id: '99',
//       address: 'bareilly',
//       country: 'india'
//     },
//     pathname: '/about',
//     path: '/about?myname=hamza&id=99&address=bareilly&country=india',
//     href: '/about?myname=hamza&id=99&address=bareilly&country=india'
//   }
