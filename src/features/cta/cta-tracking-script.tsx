import Script from "next/script";

export function CtaTrackingScripts({ nonce }: { nonce?: string }) {
  return (
    <>
      <Script
        src="https://trk.ozemgummy.com/click"
        strategy="afterInteractive"
        nonce={nonce}
      />

      <Script id="ozemgummy-inline" strategy="afterInteractive" nonce={nonce}>
        {`
document.addEventListener("DOMContentLoaded",function(){
  var d="trk.ozemgummy.com",_es="PageView,ViewContent",v=_es.split(','),c,a=0,m=10,r=500,
  sc=function(cn,cv,exd){
    var ex="";
    if(exd){
      var dt=new Date;
      dt.setTime(dt.getTime()+864e5*exd);
      ex="; expires="+dt.toUTCString()
    }
    document.cookie=cn+"="+cv+ex+"; path=/; SameSite=Lax; Secure"
  },
  f=function(){
    var p=new URLSearchParams(location.search),
      pn=["rtkcid","clickid","tid","subid","cid"],
      fc=null,k,vl;
    for(k=0;k<pn.length;k++){
      vl=p.get(pn[k]);
      if(vl){fc=vl;break}
    }
    if(fc){sc("rtkclickid-store",fc,30);return fc}
    var cm=document.cookie.match(/(?:^|;\\s*)rtkclickid-store=([^;]+)/);
    return cm&&cm[1]?cm[1]:null
  },
  s=function(i){
    v.forEach(function(e){
      var ev=e.trim();
      if(ev){
        var n=new Image;
        n.src="https://"+d+"/postback?format=img&type="+encodeURIComponent(ev)+"&clickid="+encodeURIComponent(i)
      }
    })
  },
  t=function(){
    (c=f())?s(c):a<m&&(a++,setTimeout(t,r))
  };
  t();
});
        `}
      </Script>
    </>
  );
}
