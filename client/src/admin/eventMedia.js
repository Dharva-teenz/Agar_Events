export function appendAlbumPhoto(draft,upload){
  return {...draft,images:[...(Array.isArray(draft.images)?draft.images:[]),{
    url:upload.url,assetId:upload.assetId||'',alt:draft.title||'Event photograph'
  }]};
}

export function setAlbumCover(draft,{url,assetId=''}){
  return {...draft,coverImage:url,coverAssetId:assetId};
}

export function clearAlbumCoverIfRemoved(draft,image){
  const images=(draft.images||[]).filter(item=>item!==image);
  return draft.coverImage===image.url?{...draft,coverImage:'',coverAssetId:'',images}:{...draft,images};
}
