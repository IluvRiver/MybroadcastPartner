import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MyPage from '../Pages/MyPage';
import LivePage from '../Pages/LivePage';
import PayPage from '../Pages/PayPage';
import RankingPage from '../Pages/RankingPage';
import Feedback from '../Pages/Feedback';
import InfoPage from '../Pages/InfoPage';
import SubScriptionPage from '../Pages/SubscriptionPage';
import InfonavPage from '../Pages/Infonavpage';
import BlackList from '../Pages/BlackList';
import Facesetiment from '../Pages/Facesetiment';
import Trendcontents from '../Pages/Trendcontents';
import Videosetiment from '../Pages/Videosetiment';
import Aicontents from '../Pages/Aicontents';
import VideoInfo from '../Pages/VideoInfo';
import NotFound from '../Pages//NotFound';

function AppRoutes() {
  const location = useLocation();
  const showNotFound = !['/', '/signup', '/live', '/mypage', '/paypage', '/ranking', '/info', '/subscript', '/blacklist', '/facesetiment', '/trendcontents', '/videosetiment', '/aicontents', '/videoInfo'].includes(location.pathname);

  return (
    <Routes>
      <Route path = "/live" element={<LivePage/>}></Route>
      <Route path = "/feedback" element={<Feedback />}></Route>
      <Route path = "/mypage" element={<MyPage />}></Route>
      <Route path = "/paypage" element={<PayPage />}></Route>
      <Route path = "/ranking" element={<RankingPage />}></Route>
      <Route path = "/infonav/*" element={<InfonavPage />}/>
      <Route path = "/info" element={<InfoPage />}></Route> 
      <Route path = "/subscript" element={<SubScriptionPage />}></Route>
      <Route path = "/blacklist" element={<BlackList />}></Route>
      <Route path = "/facesetiment" element={<Facesetiment />}></Route>
      <Route path = "/trendcontents" element={<Trendcontents />}></Route>
      <Route path = "/videosetiment" element={<Videosetiment />}></Route>
      <Route path = "/aicontents" element={<Aicontents />}></Route>
      <Route path = "/videoInfo" element={<VideoInfo />}></Route>
      {showNotFound && <Route path="*" element={<NotFound />} />}
    </Routes>
  );
}

export default AppRoutes;
