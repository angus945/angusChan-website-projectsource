---
title: "Setup"
date: 2021-04-26T14:55:17+08:00
lastmod: 2021-04-28T14:50:17+08:00
draft: true
keywords: []
description: ""
tags: [shader]
category: tutorial
author: ""
order: 0
similarpagelink: byorder
listable: true

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---
# Setup

## 前置作業和注意事項

教學開始前的前置作業，後面部分不會在重複，請視情況自己執行

### 設置資料

環境 Unity、2D

版本 Unity 2019.4.2f1

使用語言 Shaderlab (HLSL、CG)、C#

腳本工具 Visual Studio Code

紀錄工具 Unity Recorder

攝影機比例 1 : 1

### 初始設置

首先在場景建立一個 Quad 作為渲染目標，以及設置一顆材質球和 Image Shader，並隨便放一張 Texture 確保 Material 能夠渲染

{{< pathImage setup_0.jpg >}}

選 quad 的原因是因為它的大小固定 1 unit，不像 sprite 會受到 texture 影響，但事實上這個著色器也能夠用在 SpriteRenderer，沒有硬性規定要使用哪種

把 camera 的 size 改為 0.5，讓圖能夠剛好填滿 game view

{{< pathImage setup_1.jpg >}}

也可以直接在 scene view 看效果，這項設置的目的主要是我要錄影的關係，然後要注意 game View 中只有在 paly mode 時才看的到時間相關的著色器變量效果 

### 腳本設置

開啟腳本，如論你要用什麼工具都可以，我這裡使用的是 vscode 

為了確保渲染精度，我們會在片段 frag 著色器上面進行計算，所需的資料只有 uv

首先繪製出 uv 空間，其他部分保持不動就好，沒有 Alpha Blend

```csharp
fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = float4(i.uv.xy, 0, 1);
    return col;
}
```

{{< pathImage setup_2.jpg "50%" >}}

### 標準化空間

原本的 uv 空間是從左下開始，從 0 ~ 1 的數值範圍，我們希望將圖畫在正中心，所以要將原點設置回圖片的中心，將範圍變成 -1 ~ 1

這裡提供一個變量 scale，作為空間大小的輸入值，先用 1 即可，之後視情況更改

```csharp
float2 spaceNormalize(float2 uv, float scale)
{
    return (uv - 0.5) * 2 * scale;
}
fixed4 frag (v2f i) : SV_Target
{
    float2 uv = spaceNormalize(i.uv, 1);
    
    fixed4 col = float4(uv.xy, 0, 1);
    return col;
}
```

{{< pathImage setup_3.jpg "50%" >}}

教學內容偏長，極度不建議把全部東西都寫在同一個腳本裡，可以自己視情況使用新的腳本，只要記得完成初始設置以及複製使用到的距離場函數就好

以上就是教學開始前的初步設置，後面的部分將省略這項作業，請注意每篇開頭的提醒
