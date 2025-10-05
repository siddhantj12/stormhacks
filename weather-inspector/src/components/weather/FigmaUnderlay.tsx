'use client'

export default function FigmaUnderlay() {
  const BOX = (x:number,y:number,w:number,h:number,r=18, a=0.5) => (
    <div
      key={`${x}-${y}-${w}-${h}`}
      style={{
        position:'absolute', left:x, top:y, width:w, height:h,
        background:`rgba(177,191,191,${a})`, borderRadius:r, boxShadow:'0 6px 16px rgba(0,0,0,.15)'
      }}
    />
  )

  return (
    <>
      {/* Top stat cards (4) — from your Figma dump */}
      {BOX( 92,483,161,161,18,0.5)}   {/* Location/Date */}
      {BOX(268,483,161,161,18,0.5)}   {/* Precip */}
      {BOX(444,483,161,161,18,0.5)}   {/* Wind */}
      {BOX(620,483,161,161,18,0.5)}   {/* UV */}
      {BOX(796,483,161,161,18,0.5)}   {/* Sunrise/Sunset */}

      {/* Bottom weekly panel */}
      {BOX( 92,664,865,266,24,0.6)}

      {/* Right vertical 12-hour panel */}
      {BOX(1102,183,345,749,0,0.6)}
    </>
  )
}
