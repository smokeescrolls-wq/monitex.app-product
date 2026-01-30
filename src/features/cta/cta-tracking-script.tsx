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
        {`(function(){
  var d="trk.ozemgummy.com";
  var events="PageView,ViewContent".split(",");
  var tries=0, maxTries=10, retryMs=500;

  function setCookie(name, value, days){
    var ex="";
    if(days){
      var dt=new Date();
      dt.setTime(dt.getTime() + days*864e5);
      ex="; expires=" + dt.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + ex + "; path=/; SameSite=Lax; Secure";
  }

  function getClickId(){
    try{
      var p=new URLSearchParams(window.location.search);
      var keys=["rtkcid","clickid","tid","subid","cid"];
      for(var i=0;i<keys.length;i++){
        var v=p.get(keys[i]);
        if(v){
          setCookie("rtkclickid-store", v, 30);
          return v;
        }
      }
    }catch(e){}
    var m=document.cookie.match(/(?:^|;\\s*)rtkclickid-store=([^;]+)/);
    return m && m[1] ? decodeURIComponent(m[1]) : null;
  }

  function fire(clickId){
    for(var i=0;i<events.length;i++){
      var ev=(events[i] || "").trim();
      if(!ev) continue;
      var img=new Image();
      img.src="https://" + d + "/postback?format=img&type=" + encodeURIComponent(ev) + "&clickid=" + encodeURIComponent(clickId);
    }
  }

  function tick(){
    var id=getClickId();
    if(id) return fire(id);
    if(tries++ < maxTries) setTimeout(tick, retryMs);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", tick, { once: true });
  } else {
    tick();
  }
})();`}
      </Script>
    </>
  );
}
