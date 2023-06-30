var a = fetch("https://horoscope.astrodevam.com/panchang.php", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,kn;q=0.7",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "iframe",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "_ga=GA1.2.1549191792.1687847550; _hjSessionUser_1337494=eyJpZCI6IjExYzBjNTMwLTIxNzctNTdmNC05ZmJkLTdhMjAzMjIxMmVkZCIsImNyZWF0ZWQiOjE2ODc4NDc1NTIzMDEsImV4aXN0aW5nIjp0cnVlfQ==; __utmc=30267055; _gid=GA1.2.318550259.1688118549; _hjSession_1337494=eyJpZCI6ImQzNGIxZjYwLTU4ZTUtNGM1YS04OWYzLWM3Y2MzNjYzNTg4NSIsImNyZWF0ZWQiOjE2ODgxMTg1NTAxNzgsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; PHPSESSID=hgtmv4euivupo24eubr4t1jcn1; __utma=30267055.1549191792.1687847550.1688118548.1688121987.3; __utmz=30267055.1688121987.3.3.utmcsr=horoscope.astrodevam.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=30267055.1.10.1688121987; _ga_8FTPRFHJLE=GS1.2.1688121366.3.1.1688121987.0.0.0; _hjIncludedInSessionSample_1337494=0"
  },
  "referrer": "https://horoscope.astrodevam.com/panchang.php",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "citystatus=0&match=&HiddenPlaceOfBirth=Mysore&partner=&citystatus=0&match=&HiddenPlaceOfBirth=Mysore&partner=&DD=8&MM=4&YY=2024&country=India&TxtPlaceOfBirth=Mysore&Submit=Submit+%3E%3E",
  "method": "POST",
  "mode": "cors"
});

a.then(r => {
    r.text().then(text => {
      console.log(text);
    });
  });