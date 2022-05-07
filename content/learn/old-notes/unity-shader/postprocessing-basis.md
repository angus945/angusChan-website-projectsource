---
title: "Postprocessing Basis"
date: 2020-11-27
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

PostProcessing Shader  
基本設置

使用OnRenderImage和 Shader對畫面進行後處理

建立C# 腳本並掛在Camera 上
[SerializeField] Shader shader = null;
Material material;

void OnEnable()
{
    material = new Material(shader);
}
void OnRenderImage(RenderTexture source, RenderTexture destination)
{
    source 為輸入，destination 則為輸出結果
    Graphics.Blit 函式，使用shader 渲染texture
    
    Graphics.Blit(source, destination, material);
}
文檔 OnRenderImage https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnRenderImage.html
文檔 Graphics.Blit
https://docs.unity3d.com/ScriptReference/Graphics.Blit.html

建立Shader
Create > Shader > Image Effect Shader
fixed4 frag (v2f i) : SV_Target
{
    _MainTex 就是OnRenderImage 的輸入，整個畫面擷取的Texture (Frame Buffer的資料)，
    在這裡進行計算，輸出的結果就是整個畫面的渲染解果
    範例是整個畫面的負片效果 (1 - color)
    
    fixed4 col = tex2D(_MainTex, i.uv);
    col.rgb = 1 - col.rgb;
    return col;
}
註: 建立vertex shader 也行，重點只是在fragment shader (frag)


重點變量
float2 _MainTex_TexelSize
_MainTex 對應螢幕像素的UV 大小，可以透過這個變量取得MainTex 鄰近像素
tex2D(_MainTex, uv + float2(_MainTex_TexelSize.x, 0))

重點數學
kernel, convolution Matrix
用一個不同權重的3*3(或更大) 網格，把像素輸入然後根據輸出結果做任何事
https://www.youtube.com/watch?v=C_zFhWdM4ic&feature=emb_title
註: 後面的筆記不會再解說這個計算

一些後處理的資料
https://zhuanlan.zhihu.com/p/29228304
https://blog.csdn.net/qq_36383623/article/details/86303938

實作各種效果的教學
https://danielilett.com/2019-04-24-tut1-intro-smo/

更新註記: 我搞錯了，數學計算是叫 kernel，Sobel operator是他的衍生，用於邊緣檢測