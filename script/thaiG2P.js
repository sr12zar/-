// This a part of a Thai G2P for Espeak NG Thai project (in progress)
// (C) 20019 - 2023 by Sunthorn Rathmanus of SDK Datafarm QLD AUS
// The Javascriptcode is released in hope that it would be useful 
// but no guarranty is provided nor any liability accepted.

function g2p(w) {
// translate the given word into ipa code
  h = ""; v = ""; t = ""; e = ""; tn=""; // use globals to pass values
  dbl = 0; dw = ""; pause = "";

  //console.log("entered g2p() with " + w); 
  factor(w);
 
   // review parts and fix odd bits -- using global h,v,t,e,dbl 
   if ( h.substr(0,1) != "*") {
     fixhead(); 
     if ( e.search(/\์/) ) karant();
       fixvowel();
     if ( e ) fixend();
       fixtone();
     //console.log( ">> g2p-exit w= " + w + " h= "+ h +" v= "+ v +" t=" + t + " e=" + e );
     // if (dbl) dw="|" ipa[h] "'" ipa[v] t "=" ipa[e]; // repeat for ๆ (dbl)
     // return  ipa[h] "'" ipa[v] t "=" ipa[e] dw pause
   } 
//   else if (substr(h,1,2)=="*-") { // abbreviation say it with a pause
//      for (l=3; l<=length(h); l++) { dw=dw ipa[substr(h,l,1) "."] "_:" }     
//      return dw
//   }	   
    return [ h, v, e, t, tn ];
    //return (" head="+ h +" vowel= "+ v +" end=" + e + " mark=" + t + " tone=" + tn ); 
}

function factor(w) {
// analyse parts: head, vowel, tail, tone
  //console.log("enter factor() with w=" + w);
  var s=[];
//  if ( w.search(/ๆ/) > 0 ) dbl = 1;

  if (w.search(/เ/) == 0) { // เ-vowels
    //console.log("have an  เ");
    if ( w.search(/ะ/) > 1) { // เ*ะ short vowels
      if (w.search(/ี/) > 1) { // เ-ียะ
        s=w.match(/(\เ)(.{1,2})(\ี)([\่\้\๊\๋]?)(\ย\ะ)(.*)/);
        h=s[2]; v="เ-ียะ"; t=s[4]; e=s[6]; }
      else if (w.search(/ื/) > 1) { // เ-ือะ
        s=w.match(/(\เ)(.{1,2})(\ื)([\่\้\๊\๋]?)(\อ\ะ)(.*)/); 
        h=s[2]; v="เ-ือะ"; t=s[4]; e=s[6]; }
      else if (w.search(/อ/) > 1) { // เ-อะ
        s=w.match(/(\เ)(.{1,2})([\่\้\๊\๋]?)(\อ\ะ)(.*)/);
        h=s[2]; v="เ-อะ"; t=s[3]; e=s[5]; }
      else if (w.search(/า/) > 1) { // เ-าะ
        s=w.match(/(\เ)(.{1,2})([\่\้\๊\๋]?)(\า\ะ)(.*)/);
        h=s[2]; v="เ-าะ"; t=s[3]; e=s[5]; }
      else { // เ-ะ no end char
        s=w.match(/(\เ)(.)([\่\้\๊\๋]?)(\ะ)/); 
        h=s[2]; v="เ-ะ"; t=s[3]; e=""; } 
        //console.log("exit เ*ะ short complex vowel"); //***
      } // end เ*ะ short vowels

    else { // no ะ --> long เ-* vowels
      //console.log("no ะ  long เ-* complex vowel");   
      if (w.search(/\ี/) > 1) { // เ-ีย
        s=w.match(/(เ)(.{1,2})(\ี)([\่\้\๊\๋]?)(ย)(.*)/);
        h=s[2]; v="เ-ีย"; t=s[4]; e=s[6]; }
      else if (w.search(/\ื/) > 1) { // เ-ือ
        s=w.match(/(เ)(.{1,2})(\ื)([\่\้\๊\๋]?)(อ)(.*)/);
        h=s[2]; v="เ-ือ"; t=s[4]; e=s[6]; }
      else if (w.search(/เ.*อ/) > -1) { // เ-อ *** 
        s=w.match(/(เ)([^\่\้\๊\๋]{1,2})([\่\้\๊\๋]?)(อ)/);
        h=s[2]; v="เ-อ"; t=s[3]; e=""; }
      else if (w.search(/า/) > 1) { // เ-า
        s=w.match(/(เ)([^\่\้\๊\๋]{1,2})([\่\้\๊\๋]?)(า)(.*)/);
        h=s[2]; v="เ-า"; t=s[3]; e=s[5]; }
      else if (w.search(/\ิ/) > 1) { // เ-ิ = เ-อะ **short but no ะ
        s=w.match(/(เ)([^\ิ]{1,2})(\ิ)([\่\้\๊\๋]?)(.*)/);
        h=s[2]; v="เ-อะ"; t=s[4]; e=s[5]; }
      else { // เ-? ** others 
        s=w.match(/(เ)(ว|กษ|ห[ญมนรลย]|.[วลร]*)([\่\้\๊\๋]?)(.*)/); //***to do
        //console.log("check เ-? others " + s);
        h=s[2]; v="เ-"; t=s[3]; e=s[4]; }         
      } // end long เ-* vowels
    } // end เ-vowels
  else { // not-เ  vowel ie. other front vowels   
    //console.log("enter not-เ  ie. other front vowels"); 
    if (w.search(/แ.+ะ/) == 0) {
      s=w.match(/(\แ)(,[^\่\้\๊\๋]{1,2})([\่\้\๊\๋]?)(\ะ)(.*)/); // แ-ะ
      h=s[2]; v="แ-ะ"; t=s[3]; e=s[5]; }

    else if (w.search(/โ.+ะ/) == 0) {
      s=w.match(/(\โ)([^\่\้\๊\๋]{1,2})([\่\้\๊\๋]?)(\ะ)(.*)/); // โ-ะ
      h=s[2]; v="โ-ะ"; t=s[3]; e=s[5]; }

    else if (w.search(/\ั.*วะ/) > 0 ) { // -ัวะ ** not front vowel
      //s=w.match(/(.[^\่\้\๊\๋]?{1,2})(\ั)([\่\้\๊\๋]?)(\ว\ะ)(.*)/);
      s=w.match(/(.[^\่\้\๊\๋]?)(\ั)([\่\้\๊\๋]?)(\ว\ะ)(.*)/); //***
      h=s[1]; v="-ัวะ"; t=s[3]; e=s[5]; }
     
    else if (w.search(/ไ.+ย/) == 0 && w.search(/ย/) > 1) { // ไ-ย
      s=w.match(/(\ไ)(.?})([\่\้\๊\๋]?)(\ย)(.*)/);
      h=s[2]; v="ไ-ย"; t=s[3]; e=s[5]; }

   else if ( w.search(/[เแไใโ]/) == 0 ) { // [เ-แ-ไ-ใ-โ-] front vowel
      //console.log(" check point [เ-แ-ไ-ใ-โ-] " + w);
      //s=w.match(/([\เ\แ\ไ\ใ\โ])(ว|กษ|ห[ญมนรลย]|.[วลร]?)([\่\้\๊\๋]?)(.*)/); 
      s=w.match(/([\เ\แ\ไ\ใ\โ])(ว|กษ|ห[ญมนรลย]|.[วลร]?)([\่\้\๊\๋]?)(.*)/); //***
      //console.log("test [เแไใโ] " + s);
      h=s[2]; v=s[1]+"-"; t=s[3]; e=s[4]; } 
     
    else if ( w.search(/ั[\่\้\๊\๋]?ว/) > 0 ) { // -ัว  
      s=w.match(/(.[^\่\้\๊\๋]?)(\ั)([\่\้\๊\๋]?)(ว)/); 
      h=s[1]; v="-ัว"; t=s[3]; e=""; }

    else if ( w.search(/ั.*ม/) > 0 ) { // -ัม
      s=w.match(/(.[^\่\้\๊\๋]?)(\ั)([\่\้\๊\๋]?)(ม)(.*)/); 
      h=s[1]; v="-ำ"; t=s[3]; e=""; }

    else if ( w.search(/ั[\่\้\๊\๋]ย/) > 0 ) { // -ัย  ***ทรัพย์ ? 
      s=w.match(/(.[^\่\้\๊\๋]?)(\ั)([\่\้\๊\๋]?)(ย)/); // rm (.*)$ for -ย์ 
      h=s[1]; v="ไ-"; t=s[3]; e=s[4]; }
  
    else if (w.search(/ื/) > 0) { // -ื 
      s=w.match(/(.[^\่\้\๊\๋]?)(\ื)([\่\้\๊\๋]?)([อน])(.*)/);
      h=s[1]; v="-ื"; t=s[3]; e=s[4]; }
     
    else if (w.search(/รร/) > 0) { // รร
      s=w.match(/(.[^\่\้\๊\๋]?)(\ร\ร)([\่\้\๊\๋]?)(.*)/);
      h=s[1]; v="-"+s[2]; t=s[3]; e=s[4]; }
    
            // need to ignore 1st char h=อ v=-อ cases    
    else if (w.substring(1,).search(/[อะาำฤ]/) > -1) { // -อ -ะ -า -ำ -ฤ 
      s=w.match(/(.[^\่\้\๊\๋]?)([\่\้\๊\๋]?)([\อ\ะ\า\ำ\ฤ])(.*)/);
      h=s[1]; v="-"+s[3]; t=s[2]; e=s[4]; 
      console.log('analyze: '+w + '=> ' + h +', '+v+', '+ e +', ' + t);
      }

    else if ( w.search(/[\ิ\ี\ั\ึ\ื\ุ\ู\ั\็]/) > 0) { // [-ิ -ี -ั -ึ -ื -ุ -ู -็ -ั] ** top & bottom vowels
      s=w.match(/(.[^\่\้\๊\๋]?)([\ิ\ี\ึ\ื\ุ\ู\็\ั])([\่\้\๊\๋]?)(.*)/);
      h=s[1]; v="-"+s[2]; t=s[3]; e=s[4]; }

    // from here on we do not have any explicit vowel (graphene) in w
    else if ( w.search(/[\เ\แ\ไ\ใ\โ\ะ\า\ิ\ี\ึ\ื\ุ\ู\ำ\็\ั]/) == -1 ) { // ***no explicit vowel***   
      //console.log(" ***enter no explicit vowel*** " + w);  
      if (w.search(/\.$/) > 0) { // a dot -- abbreviation? eg. พ.ศ. or คสช. 
         h="*-" + w; 
         //console.log("*- abbrev. ** " + h ); 
         }

      else if ( w.search(/(.[^\่\้\๊\๋]?)([\่\้\๊\๋]?)(ว)(.+)/) != -1) { //** ว +1e for -ัว eg. กวก 
         s=w.match(/(.[^\่\้\๊\๋]?)([\่\้\๊\๋]?)(ว)(.{1,})/);
         h=s[1]; v="-ัว"; t=s[2]; e=s[4]; }

      else if (w.search(/(ขจ|ขบ|สก|สง|สน|สบ|สม|หม|หย|.[รลวอ]?)([\่\้\๊\๋]?)(.*)/) != -1) { 
         // hidden vowel some โ : กก ขก บน  some อ : กร 
         //console.log("hidden vowel " + w);
         s=w.match(/(ขจ|ขบ|สก|สง|สน|สบ|สม|หม|หย|.[รลวอ]?)([\่\้\๊\๋]?)(.*)/); //***
         h=s[1]; v="-"; t=s[2]; e=s[3]; // *** v= "-" need to fix in fixvowel()
        
        //console.log("exit ***no explicit vowel*** " + w); 
      } // end ***no explicit vowel*** 

    } //end not-เ  ie. other front vowels

      //else { // missed all catches return as is
      if (h == "" && v== "") { // still no head nor vowel 
        h="*?"+ w; 
        //console.log("*? missed all ** " + h); 
        }
  }
  //console.log("exit factor() h= "+ h +" v= "+ v +" t=" + t + " e=" + e );
}

function fixhead(){
// check for compound head chars
  //console.log(" enter fixhead h=" + h + " v=" + v +" t=" + t + " e=" + e );
  let h1=h.substr(0,1);
  if (h1 != "*") {
     if (h == "ทร" && v.match(/\-[\ะ\า\ี]/) ) { h="ซ";}
     else if ((h == "สร") || (h1.match(/[ษศ]/)) ) { h="ส";}
     else if (h == "ณ") { h="น";}
     else if (h == "ภ") { h="พ";}
     else if (h == "ญ") {h="ย"; }
     else if ((e == "" ) && (t=="")) { // ** no end char & no tone
       if ( h.match(/[กคซนตบมรลวห]ว/) ) {  //***to do กว า ่
         h=h1; e="ว";} // .ว --> . ว             
       else if (h.match(/.[กงดนบมรล]/) ) { // 2 consecutive chars
         if (v == "-") { 
           e=h.substr(1,1); h=h1;} // no explicit vowel             
         } 
       }
     //else if (h.match(/[กขคขฉช][สษศ]/) ) { // กษ->ก ๎ส; ชร ฉล ตล??
     //         h=h1 + " ๎" + h.substr(1,1); }
    }
  //console.log(" exit fixhead h=" + h + " v=" + v +" t=" + t + " e=" + e );
} 

function karant(){
// Karant - in a word may cover after [the vowel [the tone]] 1-3 chars and -์
// for words from Pali/Sanskrit karant if present is the last char of the word
// from other languages, karant can be used to half/partly silence the char it follows
// a half ะ vowel is needed -- yamakkarn \์ is not on keyboard _็ is similar in function

   // console.log( h, v, t, e " << karant-in"); 
   if (e) { // karant must follow at least 1 char   
      if ( e.match(/\์/) )  // karant present 
         if ( e.search(/\์$/) ) {  // karant is last
           let el2=e.substr(-2,1); // get char karant is over 
           //console.log(" in karant el2=" + el2);
           if ( el2.match(/[\ิ\ุ]/) ) // is after sara -ิ or -ุ?
              e=e.slice(-5,-3);  // remove last 3 chars *** assumed e maxlen 5
           else
              e=e.slice(-5,-2);  // remove last 2 chars
           }
        else { //e=e.replace(/\์/, " ๎"); // karant not last - substitute \์ with \ ๎  ???      
           e=e.slice(-5,-2);           // drop the char and karant **
           }
   } 
   //else no karant 
   //console.log(" exit karant h=" + h + " v=" + v +" t=" + t + " e=" + e ); 
}

function fixvowel(){
// rationalize various vowel codings
//console.log(" enter fixvowel h=" + h + " v=" + v +" t=" + t + " e=" + e );
   if (v == "-" ) { // no explicit vowel but either โ-ะ or อ
      if ((e == "") || (e == "ร") )  v="-อ";
      else  v="โ-ะ";
      }
   else if ( v == "-รร") {         
      if (e == "") { v="-ะ"; e="น"; }
      else if (e == "ม") { v="-ำ"; e=""; }
      }
   else if (v == "-ฤ") {  
      h=h+"ร"; 
      if (e.substring(0,1) == "ก")  v="เ-อ";
      else v="-ิ";
      }
   else if ((v == "ใ-") || (v == "ไ-") ) { // maybe redundant
      v="ไ-";
      if (e == "ย")  e="";
      }
   else if ((v == "-ั") || (v == "-ะ") ) { // maybe redundant
      if (e == "ย")  { e=""; v="ไ-";}
      else v="-ะ";
      }
   else if (v == "เ-ิ")  v="เ-อ";      
   else if (v == "-ว")  v="-ัว";
   // else v as is
   //console.log(" exit fixvowel h=" + h + " v=" + v +" t=" + t + " e=" + e );
}
function fixend(){
// transform end consonant(s) into 1 of 8 end-categories (no-end is a category)
// end consonants : (no end), ย, ง, ว, and ม remain as is;
// ด ช ซ ฏ ฉ ฌ ธ ฑ ท ฐ ต ส ศ ษ ฮ -> ด; ญ น ณ ล ร -> น; ก ข ค ฆ -> ก; บ พ ฟ ป -> บ
  //console.log(" enter fixend h=" + h + " v=" + v +" t=" + t + " e=" + e );

  if ( e ) { // re-consider the 'end' if not empty
     let e1=e.substr(0,1); 
     if ((e1 == "ว") || (e1 == "อ") ) { // possible vowel
        if (v == "-") { // no vowel but place holder
           v="-" + e1; e=e.substr(1,); 
         }
     }
     else if (e1.match(/[งมย]/) )  e=e1;
     else if (e1.match(/[กขคฆ]/) )  e="ก";
     else if (e1.match(/[บปภพฟ]/) )  e="บ";
     else if (e1.match(/[ญนณรลฬ]/) )  e="น"; // ** นท/นต/... cases?           
     else if (e1.match(/[ดจชซฉฌฎฏฐธฑฒทตถสศษฮ]/) )  e="ด";             
     // something else as is
   }
  //console.log(" exit fixend h=" + h + " v=" + v +" t=" + t + " e=" + e );
}
function fixtone(){
//*** terms: none: <no end>; dead end: ก ด บ; live end: น ง ม ย ว
//*** Rules:
//- R1: low tone head + short vowel + no/dead end --> high tone -๋ 
//- R2: low tone head + long vowel + any end --> low tone -่ ??? level
//- R3: high tone head + short vowel + none --> low tone -่
//- R4: high tone head + any vowel + dead-end --> low tone -๋
//- R5: high tone + -่ --> -่ ; + -้ --> -้ ; + -๊ --> -๊
//- R6: low tone + -่ --> -้ ; + -้ --> -๊ ; prefixed with ห, อ, a high tone char --> -๋
//- R7: others as they are transcribed. 
// change tone mark to number t: "" = 0,  others "-่-้-๊-๋" = 1,2,3,4
  //console.log(" enter fixtone h=" + h + " v=" + v +" t=" + t + " e=" + e ); 
  //let tn="-1"; // set tone to 'level'
  let h1=h.substr(0,1); // 1st char of head
  let v9=v.substr(v.length-1,1); // last char of vowel *** can be a "-" as in โ- เ- ...

   if ( h1.match(/[คฅฆงชซฌญฑฒณทธนพฟภมยรลวฬฮ]/) ) { // low tone head    
      if ( (v9.match(/[\ะ\ิ\ึ\ุ]/) && (!e)) || (e.match(/[กดบ]/) && (!v)) ) { // R1 short vowel
         tn="4"; // set high and check R5
         //console.log(" low tone head with short vowel : h=" +h +" v=" +v );
         if      (t == "่") { tn="1"; }
         else if (t == "้") { tn="2"; }
         else if (t == "๊") { tn="3"; }
         }           
      else { // R2 - long vowel
         tn="0"; // set low and check R6 ??? tn=1
         if      (t == "่") { tn="2"; }
         else if (t == "้") { tn="3"; }
         }           
      }
   else if (h1.match(/[ขฃฉฐถผฝศษสห]/) ) { // high tone head 
      tn="0"; // set tone 'norm' first
      if ( (v9.match(/[\ะ\ิ\ึ\ุ]/) && (!e)) || (e.match(/[กดบ]/)) ) { // R3 or R4
         tn="1"; // set low and check R6
         //console.log("high tone head with short vowel : h=" +h +" v=" +v );
         if      (t == "่") { tn="2"; }
         else if (t == "้") { tn="3"; }
         }
      else if ( h.match(/(สก|สค|สต)/) ) { tn="0"; } // foreign words ???
           else { 
             // set high and check R5
             if      (t == "่") { tn="1"; }
             else if (t == "้") { tn="2"; }
             else if (t == "๊") { tn="3"; }
             } 
      }
   else { // as is by R7 -- norminal tone as tone mark
      if       (t == "") { tn="0"; }
      else if  (t == "่") { tn="1"; }
      else if  (t == "้") { tn="2"; }
      else if  (t == "๊") { tn="3"; }
      else if  (t == "๋") { tn="4"; } 
      }
   //console.log(" exit fixtone h=" + h + " v=" + v +" tn=" + tn + " e=" + e );
}
/*
function w2s(w) {
//split a long compound word into "component words"
// by a front vowel [เ แ โ ไ ใ] or a [ะ า] 
}
function n2p(w, i,ix) { # note local i and ix to avoid corrupting other i
#===========# convert a simple number to words (in ipa)  
   #print  "<< n2p in  w=" w 
   n=""; # remove blank and convert TH number to arabic
   if (match(w,/[๐๑๒๓๔๕๖๗๘๙]/)) 
      for (i=1; i<=length(w); i++) { n=n cv[substr(w,i,1)] } 
   else n=gensub(/[, ]/, "", "g", w)
   #print "n2p(" n ")"
   w=n; tx=""; split(w, p, "."); # split decimal number
   if (substr(p[1],1,1)=="-") { tx="l'q3p"; p[1]=substr(p[1],2); } 
   else if (substr(p[1],1,1)=="+") { tx="b'uak"; p[1]=substr(p[1],2); }
   lp1=length(p[1]); lp2=length(p[2])
   if (lp1==0) p[1]="0"

   for (i=1; i <= lp1; i++) {
       p1i=substr(p[1],i,1); ix=(lp1-i)%6; # print "***ix=" ix
       if (p1i=="1" && ix==0 && substr(p[1],i-1,1)!="0") tx=tx "'e0t_|"
       else if (p1i=="2" && ix==1) tx=tx "j'ii2|" d[1] "|" # 20
       else if (p1i=="1" && ix==1) tx=tx d[1] "|" # 10
       else if (p1i != "0") { tx=tx u[substr(p[1],i,1)]; if (lp1-i) tx=tx "|" d[(lp1-i)%6] "|"; }
       if ((lp1-i)>5 && ix==0) tx=tx d[6] "|" # million
       if ((lp1-i)>11 && ix==0) tx=tx d[6] "|" # billion in Thai million-million
       if ((lp1-i)>17 && ix==0) tx=tx d[6] "|" # trillion **limit of implementation
   }
   if (lp2) {
      tx=tx "dZ'u1t|";   # read "."
      for (i=1; i <= lp2; i++) { tx=tx u[substr(p[2],i,1)] "|" }
   }
   #print " >> n2p exit w=" w " tx=" tx
   return tx 
}
*/
