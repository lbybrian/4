<template>
  <div>
    <div ref="hotMap" id="hotMap" ></div>
    <!-- <img src="@/assets/image/visualImgs/test.jpg"> -->
  </div>
</template>

<script>
  import "ol/ol.css";
  import Map from 'ol/Map';
  import OSM from 'ol/source/OSM';
  import TileLayer from 'ol/layer/Tile';
  import View from 'ol/View';
  import XYZ from 'ol/source/XYZ';
  import {
    defaults as defaultControls,
    FullScreen,
    ScaleLine,
    ZoomSlider
  } from 'ol/control.js';
  import Projection from 'ol/proj/Projection';
  import {
    fromLonLat
  } from 'ol/proj';
  import {
    LineString,
    MultiPolygon,
    Point,
    Polygon
  } from "ol/geom";
  import Feature from "ol/Feature";
  import {
    Heatmap as HeatmapLayer,
    Vector as VectorLayer
  } from "ol/layer";
  import {
    Vector as VectorSource
  } from "ol/source";
  import Overlay from "ol/Overlay";
  import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style,
    Text
  } from "ol/style";
  import {
    transform
  } from "ol/proj";
  export default {
    name: 'olgismap',
    props: {},
    data() {
      return {
        dataInfo: {
          map: '',
          mapData: {
            center: [103.00, 36.00],
            zoom: 2,
            minZoom: 2,
            maxZoom: 19,
          },
          hotData: [{
              "id": 10093,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Kuwait's new emir meets senior US and Iranian officials - Region - World",
              "url": "http://english.ahram.org.eg/NewsContent/2/8/386579/World/Region/Kuwaits-new-emir-meets-senior-US-and-Iranian-offic.aspx",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10096,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "US ex-diplomat Richard Schifter dies aged 97, hailed as defender of Israel",
              "url": "https://www.timesofisrael.com/liveblog_entry/us-ex-diplomat-richard-schifter-dies-aged-97-hailed-as-defender-of-israel/",
              "location": "Israel",
              "time": "2020-11-14 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 34.75,
              "lat": 31.5,
              "area": null
            },
            {
              "id": 10098,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "U.S., Iran Officials Visit Kuwait after Death of Emir",
              "url": "http://www.naharnet.com/stories/en/275475",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10099,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "Palestinian leader Shtayyeh in Kuwait to pay respects to new emir",
              "url": "https://www.timesofisrael.com/liveblog_entry/palestinian-leader-shtayyeh-in-kuwait-to-pay-respects-to-new-emir/",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10100,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkey condemns Armenian ‘attacks on civilians’ in Azerbaijan",
              "url": "https://www.qatar-tribune.com/news-details/id/199333/turkey-condemns-armenian-attacks-on-civilians-in-azerbaijan",
              "location": "Armenia",
              "time": "2020-08-25 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10101,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "Prince Charles travel: Prince could face quarantine on return to UK from Kuwait",
              "url": "https://www.express.co.uk/travel/articles/1343668/prince-Charles-prince-Wales-royal-family-quarantine-travel-ban-UK-Kuwait-FCO-travel-advice",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10102,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "US defense chief in Kuwait after death of emir",
              "url": "https://www.arabnews.com/node/1744026/middle-east",
              "location": "Kuwait",
              "time": "2020-08-25 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10106,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "US, Iran officials visit Kuwait after death of emir",
              "url": "https://www.al-monitor.com/pulse/afp/2020/10/kuwait-us-iran-royals-diplomacy.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10107,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "Prince Charles travel: Prince could face quarantine on return to UK from Kuwait",
              "url": "https://www.express.co.uk/travel/articles/1343668/prince-Charles-prince-Wales-royal-family-quarantine-travel-ban-UK-Kuwait-FCO-travel-advice",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10108,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 0,
              "title": "US, Iran officials visit Kuwait after death of emir",
              "url": "https://www.msn.com/en-us/news/world/us-iran-officials-visit-kuwait-after-death-of-emir/ar-BB19GIz0",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 0,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10109,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkey condemns Armenian forces' 'attacks on civilians' on Azerbaijan city",
              "url": "https://www.thenews.com.pk/latest/724571-turkey-condemns-armenian-forces-attacks-on-civilians-on-azerbaijan-city",
              "location": "Armenia",
              "time": "2020-10-04 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10110,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Prince of Wales offers condolences in Kuwait following...",
              "url": "https://www.thisismoney.co.uk/wires/pa/article-8803901/Prince-Wales-offers-condolences-Kuwait-following-death-ruler.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10111,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkish official condemns Armenian attack on civilians",
              "url": "https://turkishpress.com/turkish-official-condemns-armenian-attack-on-civilians/",
              "location": "Armenia",
              "time": "2020-08-25 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10114,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Farmajo arrives in Eritrea after witnessing Sudan peace deal",
              "url": "https://www.garoweonline.com/en/news/somalia/farmajo-arrives-in-eritrea-after-witnessing-peace-sudan-peace-deal",
              "location": "Eritrea",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 39,
              "lat": 15,
              "area": null
            },
            {
              "id": 10117,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkey slams Armenian 'attacks on civilians' in Azerbaijan city",
              "url": "https://www.geo.tv/latest/311480-turkey-slams-armenian-attacks-on-civilians-in-azerbaijan-city",
              "location": "Armenia",
              "time": "2020-08-25 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10118,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Kuwait's new emir meets senior U.S., Iranian officials",
              "url": "https://www.msn.com/en-xl/middleeast/top-stories/kuwaits-new-emir-meets-senior-us-iranian-officials/ar-BB19GxaV",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10121,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "Israeli expert: Early action by Trump doctors apparently averted serious illness",
              "url": "https://www.timesofisrael.com/liveblog_entry/israeli-expert-early-action-by-trump-doctors-apparently-averted-serious-illness/",
              "location": "Israel",
              "time": "2020-08-25 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 34.75,
              "lat": 31.5,
              "area": null
            },
            {
              "id": 10123,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "US, Iran officials visit Kuwait after death of emir",
              "url": "https://www.thisismoney.co.uk/wires/afp/article-8803391/US-Iran-officials-visit-Kuwait-death-emir.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10125,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Prince of Wales offers condolences in Kuwait following death of ruler",
              "url": "https://www.newsshopper.co.uk/news/national/18769494.prince-wales-offers-condolences-kuwait-following-death-ruler/",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10126,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Kuwait's new emir meets senior US and Iranian officials - Region - World",
              "url": "http://english.ahram.org.eg/NewsContent/2/8/386579/World/Region/Kuwaits-new-emir-meets-senior-US-and-Iranian-offic.aspx",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10129,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Kuwait's new emir meets senior U.S., Iranian officials",
              "url": "https://www.reuters.com/article/kuwait-emir/kuwaits-new-emir-meets-senior-us-iranian-officials-idUSL8N2GV04Y",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10130,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "US Secretary of Defense Mark Esper in Kuwait after death of Emir",
              "url": "https://english.alarabiya.net/en/News/middle-east/2020/10/04/US-Secretary-of-Defense-Mark-Esper-in-Kuwait-after-death-of-Emir",
              "location": "Kuwait",
              "time": "2020-08-25 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10131,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Prince of Wales offers condolences in Kuwait following death of ruler",
              "url": "https://www.wimbledonguardian.co.uk/news/national/18769494.prince-wales-offers-condolences-kuwait-following-death-ruler/",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10134,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Prince Charles travels to Kuwait to offer his condolences following the death of the country's ruler",
              "url": "https://www.dailymail.co.uk/femail/article-8803283/amp/Prince-Charles-travelled-Kuwait-offer-condolences-following-death-countrys-ruler.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10136,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkey condemns Armenian attacks on ‘civilians’",
              "url": "https://www.timesofisrael.com/liveblog_entry/turkey-condemns-armenian-attacks-on-civilians/",
              "location": "Armenia",
              "time": "2020-08-25 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10137,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "President to visit Kuwait on Monday",
              "url": "http://www.radio.gov.pk/04-10-2020/president-to-visit-kuwait-on-monday",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10138,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "US, Iran officials visit Kuwait after death of emir",
              "url": "https://www.al-monitor.com/pulse/afp/2020/10/kuwait-us-iran-royals-diplomacy.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10139,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "US, Iran officials visit Kuwait after death of emir",
              "url": "https://www.thisismoney.co.uk/wires/afp/article-8803391/US-Iran-officials-visit-Kuwait-death-emir.html",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10140,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "Prince of Wales offers condolences in Kuwait following death of ruler",
              "url": "https://www.wimbledonguardian.co.uk/news/national/18769494.prince-wales-offers-condolences-kuwait-following-death-ruler/",
              "location": "Kuwait",
              "time": "2020-10-04 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            },
            {
              "id": 10143,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 2,
              "title": "North Korea spotlights Iran's weapons in state media",
              "url": "https://www.upi.com/Top_News/World-News/2020/10/05/North-Korea-spotlights-Irans-weapons-in-state-media/1701601904471/",
              "location": "Iran",
              "time": "2020-10-05 00:00:00",
              "eventCount": 8,
              "level": null,
              "content": null,
              "lon": 53,
              "lat": 32,
              "area": null
            },
            {
              "id": 10148,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "INTERVIEW-Palestinian business leader hopes UAE, Bahrain will press Israel to stop settlements",
              "url": "https://www.msn.com/en-us/news/world/interview-palestinian-business-leader-hopes-uae-bahrain-will-press-israel-to-stop-settlements/ar-BB19IWrU",
              "location": "Bahrain",
              "time": "2020-08-25 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 50.5,
              "lat": 26,
              "area": null
            },
            {
              "id": 10150,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -2,
              "title": "Attack Kills 8 in Afghanistan as President Visits Doha",
              "url": "https://www.voanews.com/south-central-asia/attack-kills-8-afghanistan-president-visits-doha",
              "location": "Afghanistan",
              "time": "2020-11-30 00:00:00",
              "eventCount": -8,
              "level": null,
              "content": null,
              "lon": 66,
              "lat": 33,
              "area": null
            },
            {
              "id": 10154,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkish official condemns Armenian attack on civilians",
              "url": "https://www.yenisafak.com/en/news/turkish-official-condemns-armenian-attack-on-civilians-3550898",
              "location": "Armenia",
              "time": "2020-11-30 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10157,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "UN condemns deadly suicide attack in eastern Afghanistan",
              "url": "http://wam.ae/en/details/1395302874671",
              "location": "Afghanistan",
              "time": "2020-10-05 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 66,
              "lat": 33,
              "area": null
            },
            {
              "id": 10158,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "Turkey's Republican People's Party condemns Armenia's attack on Ganja",
              "url": "https://vestnikkavkaza.net/news/Turkey-s-Republican-People-s-Party-condemns-Armenia-s-attack-on-Ganja.html",
              "location": "Armenia",
              "time": "2020-11-14 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10161,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "CHP, MHP condemn Armenian attack on Azerbaijan",
              "url": "https://www.hurriyetdailynews.com/chp-mhp-condemn-armenian-attack-in-azerbaijan-158842",
              "location": "Armenia",
              "time": "2020-11-14 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 45,
              "lat": 40,
              "area": null
            },
            {
              "id": 10162,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": -4,
              "title": "UN condemns deadly suicide attack in eastern Afghanistan",
              "url": "https://saudigazette.com.sa/article/598768/World/America/UN-condemns-deadly-suicide-attack-in-eastern-Afghanistan",
              "location": "Afghanistan",
              "time": "2020-10-05 00:00:00",
              "eventCount": -16,
              "level": null,
              "content": null,
              "lon": 66,
              "lat": 33,
              "area": null
            },
            {
              "id": 10164,
              "level_one": "反恐",
              "level_two": "攻击",
              "level_weighting": 4,
              "score": 1,
              "title": "President Alvi visits Kuwait, offers condolences over Sheikh Sabah's death",
              "url": "https://www.dawn.com/news/1583386/president-alvi-visits-kuwait-offers-condolences-over-sheikh-sabahs-death",
              "location": "Kuwait",
              "time": "2020-10-05 00:00:00",
              "eventCount": 4,
              "level": null,
              "content": null,
              "lon": 47.75,
              "lat": 29.5,
              "area": null
            }, {
              "id": 15696,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同俄罗斯总统普京通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1758340.shtml",
              "location": "俄罗斯",
              "time": "2020-03-19 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 55.45,
              "lat": 37.35,
              "area": null
            },
            {
              "id": 15697,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "李克强同保加利亚总理鲍里索夫通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1758232.shtml",
              "location": "保加利亚",
              "time": "2020-03-19 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 42.45,
              "lat": 23.2,
              "area": null
            },
            {
              "id": 15698,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同西班牙首相桑切斯通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1757142.shtml",
              "location": "西班牙",
              "time": "2020-03-17 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 40.25,
              "lat": -3.45,
              "area": null
            },
            {
              "id": 15699,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "习近平同巴基斯坦总统阿尔维会谈",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1757053.shtml",
              "location": "巴基斯坦",
              "time": "2020-03-17 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 33.4,
              "lat": 73.1,
              "area": null
            },
            {
              "id": 15700,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "李克强会见巴基斯坦总统阿尔维",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1757048.shtml",
              "location": "巴基斯坦",
              "time": "2020-03-17 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 33.4,
              "lat": 73.1,
              "area": null
            },
            {
              "id": 15701,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同意大利总理孔特通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1756619.shtml",
              "location": "意大利",
              "time": "2020-03-16 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 41.54,
              "lat": 12.29,
              "area": null
            },
            {
              "id": 15702,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "杨洁篪应约同美国国务卿蓬佩奥通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1756617.shtml",
              "location": "美国",
              "time": "2020-03-16 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 39.91,
              "lat": -77.02,
              "area": null
            },
            {
              "id": 15704,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平就意大利发生新冠肺炎疫情向意大利总统马塔雷拉致慰问电",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1755853.shtml",
              "location": "意大利",
              "time": "2020-03-14 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 41.54,
              "lat": 12.29,
              "area": null
            },
            {
              "id": 15705,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平就伊朗发生新冠肺炎疫情向伊朗总统鲁哈尼致慰问电",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1755852.shtml",
              "location": "伊朗",
              "time": "2020-03-14 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 35.44,
              "lat": 51.3,
              "area": null
            },
            {
              "id": 15706,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平就韩国发生新冠肺炎疫情向韩国总统文在寅致慰问电",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1755851.shtml",
              "location": "韩国",
              "time": "2020-03-14 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 37.31,
              "lat": 126.58,
              "area": null
            },
            {
              "id": 15707,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平向希腊新任总统萨克拉罗普卢致贺电",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1755552.shtml",
              "location": "希腊",
              "time": "2020-03-13 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 37.58,
              "lat": 23.46,
              "area": null
            },
            {
              "id": 15709,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "李克强向马来西亚新任总理穆希丁致贺电",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1753679.shtml",
              "location": "马来西亚",
              "time": "2020-03-09 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 3.09,
              "lat": 101.41,
              "area": null
            },
            {
              "id": 15712,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "哈萨克斯坦总统托卡耶夫会见杨洁篪",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1751757.shtml",
              "location": "哈萨克斯坦",
              "time": "2020-03-03 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 51.1,
              "lat": 71.3,
              "area": null
            },
            {
              "id": 15713,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "乌兹别克斯坦总统米尔济约耶夫会见杨洁篪",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1751571.shtml",
              "location": "乌兹别克斯坦",
              "time": "2020-03-03 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 41.2,
              "lat": 69.1,
              "area": null
            },
            {
              "id": 15714,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "塔吉克斯坦总统拉赫蒙会见杨洁篪",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1751018.shtml",
              "location": "塔吉克斯坦",
              "time": "2020-03-01 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 38.33,
              "lat": 68.48,
              "area": null
            },
            {
              "id": 15715,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同古巴国家主席迪亚斯-卡内尔通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1750792.shtml",
              "location": "古巴",
              "time": "2020-02-29 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 23.08,
              "lat": -82.22,
              "area": null
            },
            {
              "id": 15716,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同智利总统皮涅拉通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1750791.shtml",
              "location": "智利",
              "time": "2020-02-29 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": -33.24,
              "lat": -70.4,
              "area": null
            },
            {
              "id": 15722,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "王毅同韩国外长康京和通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1749879.shtml",
              "location": "韩国",
              "time": "2020-02-27 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 37.31,
              "lat": 126.58,
              "area": null
            },
            {
              "id": 15726,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同阿联酋阿布扎比王储穆罕默德通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1749314.shtml",
              "location": "阿联酋",
              "time": "2020-02-25 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 24.28,
              "lat": 54.22,
              "area": null
            },
            {
              "id": 15727,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 1,
              "title": "习近平同埃塞俄比亚总理阿比通电话",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1749313.shtml",
              "location": "埃塞俄比亚",
              "time": "2020-02-25 00:00:00",
              "eventCount": 1,
              "level": null,
              "content": null,
              "lon": 9.02,
              "lat": 38.42,
              "area": null
            },
            {
              "id": 15728,
              "level_one": "政治外交",
              "level_two": "互访互信",
              "level_weighting": 1,
              "score": 2,
              "title": "习近平给比尔·盖茨回信 感谢盖茨基金会支持中国抗击新冠肺炎疫情",
              "url": "https://www.fmprc.gov.cn/web/wjdt_674879/gjldrhd_674881/t1748339.shtml",
              "location": "中国",
              "time": "2020-02-22 00:00:00",
              "eventCount": 2,
              "level": null,
              "content": null,
              "lon": 39.55,
              "lat": 116.2,
              "area": null
            },
          ]
        }
      }
    },
    watch: {},
    mounted() {
      this.$nextTick(function() {
        this.dataInfo = this.dataObj ? this.dataObj : this.dataInfo;
        this.init();
        this.updateData(this.dataInfo);
      })
    },
    methods: {
      //地图初始化
      init() {
        let that = this;
        //地图的基础配置
        this.dataInfo.map = new Map({
          target: 'hotMap',
          //新建视图
          view: new View({
            //设置中心点，将转换坐标点经度/纬度转换为其他投影，默认值为Web Mercator，即“ EPSG：3857”。
            center: fromLonLat(that.dataInfo.mapData.center),
            //设置缩放级别
            zoom: that.dataInfo.mapData.zoom || 4,
            //设置最小缩放级别
            minZoom: that.dataInfo.mapData.minZoom || 2,
            //设置最大缩放级别
            maxZoom: that.dataInfo.mapData.maxZoom || 19,
          }),
          layers: [
            new TileLayer({
                source: new OSM(),
            }),
            // new TileLayer({
            //   source: new XYZ({
            //     url: 'http://' + location.host + '/server/map/{x}/{y}/{z}'
            //     // url: 'http://192.168.30.225:9000/server/map/{x}/{y}/{z}'
            //   })
            // }),
            // new TileLayer({
            //   source: new XYZ({
            //     url: 'http://' + location.host + '/server/mapImage/{x}/{y}/{z}'
            //     // url: 'http://192.168.30.225:9000/server/mapImage/{x}/{y}/{z}'
            //   })
            // }),
          ],
        });

      },
      updateData(obj) {
        let features = [];
        let that = this;
        obj.hotData.forEach(item => {
          let coor = [parseFloat(item.lat), parseFloat(item.lon)];
          const feature = new Feature({
            geometry: new Point(coor),
            weight: 5,
            hot: "hot",
            area: item.location,
            levelOne: item.level_one
          });
          feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
          features.push(feature);
        });
        // console.log('features',features)
        let vector = new HeatmapLayer({
          source: new VectorSource(),
          blur: 10,
          radius: 5,
          weight: function(feature) {
            return parseFloat(feature.getProperties().weight);
          },
          id: "hotMap2"
        });
        vector.setZIndex(39);
        obj.map.addLayer(vector);
        vector.getSource().addFeatures(features);
        // console.log('vector',vector)
      },
      removeHotMapLayerData(map) {
        if (getLayer(map, "hotMap2")) {
          getLayer(map, "hotMap2")
            .getSource()
            .clear();
        }
      }

    },
    destroyed() {
      //清除动画的定时器
      clearInterval(this.time);
      clearInterval(this.pointTime);
    },
  }
</script>

<style scoped>
 #hotMap{
  width:100%;
  height:1000px;
  /* min-height: 1000px; */
}
</style>
