---
title: "Vertexshader Coloring"
date: 2020-07-20
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Vertex Shader筆記

2. Vertex Fragment Coloring
頂點著色和片段著色

此編筆記中只有重點程式碼

著色範例

> 使用 appdata 頂點座標著色
float4 vertex : POSITION
v2f vert (appdata v)
{
    v2f o = (v2f)0;
    o.vertex = UnityObjectToClipPos(v.vertex);
    o.color.r = v.vertex.x;
    return o;
}
fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = fixed4(0,0,0,0);
    col = i.color;

    return col;
}
著色結果會呈現左半為純黑右半為純紅，中間有簡短的過度，模型的 worldspace不會對著色造成影響
左半為黑右半為紅 > vert回傳了一個顏色，使用 appdata頂點座標 x軸當顏色的 r值
中間有簡短的過度 > 因為色彩值的範圍為 0 ~ 1，所以座標 x軸超出 0 ~ 1都會是純色
worldspace不會對著色造成影響 > 因為 appdata提供的 vertex座標為模型頂點的 local座標


> 使用 v2f 頂點座標著色
float4 vertex : SV_POSITION
v2f vert (appdata v)
{
    v2f o = (v2f)0;
    o.vertex = UnityObjectToClipPos(v.vertex);
    return o;
}
fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = fixed4(0,0,0,0);
    col.r = i.vertex.x / 1920;
    return col;
}
著色結果會呈現左邊偏黑右邊偏紅，離畫面左方越近整體越黑，離畫面右方越近整體越紅
左邊偏黑右邊偏紅 > frag回傳使用 v2f頂點座標 x軸當 r值的顏色
畫面左方整體越黑...略 > 因為 v2f提供的 vertex座標為投影壓縮後的 2D畫面座標

把光照筆記多餘的程式碼也刪了，只留重點
vertex的筆記應該都會像這樣，不然會太大篇

