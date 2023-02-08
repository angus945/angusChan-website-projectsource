---
title: "【日誌】物件筆刷和地形筆刷"
date: 2022-03-05 
lastmod: 2023-02-07

draft: false

description:
tags: [shader, compute-shader]

socialshare: false

## image for preview
feature: "/devlog/technical/gpu-object-painting/featured.jpg"

## image for open graph
og: "/devlog/technical/gpu-object-painting/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/technical/gpu-object-painting/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

<!-- https://home.gamer.com.tw/creationDetail.php?sn=5402986 -->

這次花了比較多時間處理渲染和其他問題，隔了兩周，接續上篇[【學習日誌】批量繪製物件與視錐裁剪]({{< ref "devlog/technical/gpu-viewport-culling" >}})。

<!--more-->

在上一篇日誌的最後，有說到 GPU Instance 能透過一張 visible map 去過濾物件，控制生成物件的分布和密度。

{{< resources/image "recap.jpg" "80%" >}}

但原本只能預先畫好分布圖，倒入專案在指定要使用的分佈圖，這樣編輯起來很不方便。而且要從一個單通道的灰階圖片預想出實際生成出的樣子也很不值關，所以接下來就是要添加在引擎中的編輯方式，能直接在引擎中繪製分佈圖。

畫圖嘛...巧的是我去年底去另一家面試時，有和對方聊到 Compute Shader 的問題。它當時有問我 Compute Shader 能不能用來畫圖，那時我推測的答案是可以，但具體實做方法還不確定。結果現在相同的問題也被我遇到了

## 成果展示

{{< resources/image "result-1.gif" "80%" >}}

{{< resources/image "result-2.gif" "80%" >}}

這篇日誌就是一些簡單的原理解說和過程紀錄。
注意：部份程式為 fake code，只是為了展示原理而已 :P

### 筆刷繪製

筆刷基本上就是一種距離場的應用，簡單的圓形距離場。要方形也行啦...但是意義不大。要傳入的資料有筆刷位置和大小 (brushPos, brushSize)、整張畫布的大小 canvasSize。

假設距離場函式的輸入為任意像素的座標 (pixelPos)，透過距離場，想描述筆刷在畫布上覆蓋了哪些像素只需要幾行算式。

```C#
bool PaintingPixel(Vector2 pixelPos)
{
    Vector2 uv = pixelPox / canvasSize;
    float brushDistance = length(brushPos - pixelPos) - brushSize;
    return brushDistance < 0;
}
```

如果圖像化就像這樣，當距離小於 0 就代表這個像素在筆刷的覆蓋範圍下。

{{< resources/image "brush-1.jpg" "60%" >}}

不過在實際的計算上沒必要使用判斷式，只需要將距離負值乘以筆刷強度，就能得到實際的繪製強度。最後只需要將強度 * 筆刷顏色，然後覆蓋上原始像素就能達成繪製效果

```C#
bool PaintingPixel(Vector2 pixelPos, float intensity)
{
    Vector2 uv = pixelPox / canvasSize;
    float brushDistance = length(brushPos - pixelPos) - brushSize;
    return (brushDistance * -1) * intensity;
}
```

{{< resources/image "brush-2.gif" "60%" >}}

不算很複雜，不過現在的繪製是就直接把像素寫入 RenderTexture 了，或許之後可以考慮用 Double Buffer ?

### 圖片儲存

其實繪圖或修改圖片的功能不算很難，主要重點還是在資料傳遞上，就和其他 Compute Shader 的應用一樣。修改圖片就是從 C# 端將 RenderTexture 傳入 Compute Shader。

接收 RenderTexture 的 Shader 變數是 RWTexture2D，意思是 ReadWriteTexture2D，只有這個變數允許使用者將像素資料寫入到 Texture 裡。float4 代表 rgba 四個通道，ComputeShader 好像沒有 fixed 變數的樣子。

```hlsl
RWTexture2D<float4> canvasTexture;
```

原本我嘗試傳遞一般的 Texture 進去，但不被允許。後來查了一下資料發現，好像是因為 RenderTexture 是指向 GPU Buffer 資料的，但 Texture 是指向記憶體或其他 CPU 端的資料。
所以如果要透過 ComputeShader 讀寫圖片資料，就必須先將它複製一份到 GPU 中（建立 RenderTexture），才能透過 GPU 進行修改。

至儲存的話就是再把修改後的 RenderTexture 從 C# 端複製回 Texture。原本我嘗試直接用 CopyTexture 之類的方法直接把圖片覆寫進資料夾的檔案，但一樣不被允許

如果要寫進資料夾的 Texture，必須把圖片轉成 byte[] 格式再用 System.IO 寫入。要將圖片轉成 byte[] 的話，引擎函式庫裡有提供現成方法了，只要用 UnityEngine.ImageConversion 的 Extension 就能直接轉換。把 byte[] 轉成圖片也也是。

{{< resources/image "image-storage-1.jpg" "80%" >}}

```C#
byte[] encodeData = fromTexture.EncodeToPNG();
```

不過後來想想，既然都要轉成 byte array 了，幹嘛還用圖片的形式儲存？直接把這串陣列存在地圖的資料裡不就好了，而且也不用多佔一個資料夾空間。所以我就乾脆不存圖片，等需要的時候再轉成圖片使用。

```C#
Texture2D GetTexture()
{
    Texture2D texture = new Texture2D(imageSize.x, imageSize.y, TextureFormat.RGBA32, false);
    texture.LoadImage(encodeData, false);
    texture.Apply();

    return texture;
}
```

{{< resources/image "image-storage-2.jpg" "80%" >}}

### 物件渲染

物件筆刷基本上就是把上面的圖片繪製出的圖片指定進物件剔除的 visible map 而已。

{{< resources/image "object-rendering-1.gif" "80%" >}}

物件這次的主要修改是在渲染部份。上篇文章有說到，我透過讓物件有隨著 y 軸增長的 z 軸斜率來達成正確的深度渲染。雖然 y 軸的深度計算是正確了，但如果兩個物件的 y 軸差距過小，他們寫入的深度相同也可能發生重疊閃爍。

我也有試過讓 x 軸有些斜率，但會和原本的斜率衝突，效果不佳。想來想去最後還是繞回多個 draw call 的作法了。上次放棄這種作法的是因為我不確定建立一堆 Compute Buffer 會造成什麼影響，而且也沒查到什麼資料。

後來我問了一下技美前輩，對方說我可以直接做個實驗壓力測試看看，於是我就建立了幾千個 buffer，然後讓它跑跑看。我大概要到 1000 * 3 個 buffer FPS 才會降到低於 100，同事那裡測可以到 2000 * 3 個 buffer。總之最後確定是我多慮了，如果有效能瓶頸也不是在 buffer 那裡，所以最後還是把渲染改成多個 pass。

{{< resources/image "object-rendering-2.gif" "80%" >}}

不過會發生閃爍的只有 x 軸，所以我後來把 y 軸相同的物件也包在同個 drawcall 裡，讓它一次畫多一點東西，減少沒必要的 drawcall。

{{< resources/image "object-rendering-3.gif" "80%" >}}

比較可能產生瓶頸的應該是像素的 overdraw 吧，還要在觀察。

### 物件圖層

雖然同樣類型的物件繪製時可以直接透過深度決定，但如果要繪製不同渲染方式的物體就麻煩了，像是樹蔭之類的陰影物件。樹蔭會投影在樹的底下，但又要蓋過更矮的物件，像是草。

{{< resources/image "object-layer-1.jpg" "60%" "美術概念圖" >}}

因此原本的深度排序在這裡無效，陰影必須蓋過所有比原物體真實高度還低的物件。而且陰影投影是透明度混和的計算，代表他在繪製時也不會做深度寫入。如果要讓陰影覆蓋的結果正確，就得控制不同圖層的渲染順序。

為了搞這個我研究一堆方法，還用 Command Buffer 控制不同圖層的渲染。但最後還是透過控制 Material 的 RenderQueue 來處理，直接交給引擎處理渲染順序。

{{< resources/image "object-layer-2.jpg" "80%" >}}

{{< resources/image "object-layer-3.gif" "80%" >}}

不過這樣比較尷尬的是會有陰影的重複疊加問題，因為影子也是獨立的 mesh 物件，如果有複數的影子重疊的話，陰影強度也會疊加上去，之後光影修正還要想辦法處裡。

{{< resources/image "object-layer-4.jpg" "80%" >}}

Command Buffer 的部份因為沒完全研究完，所以就不放進這篇了，那個要寫的話可以花掉一整篇。總之就是一種能把 Graphics 命令預先打包的手段，能夠一定程度的對 Built in 管線進行擴展。

### 地形筆刷

應該說是地表材質的筆刷才對，但因為我們遊戲是 2D 的所以地形就是材質，隨便拉。和物件筆刷一樣，為了使用少量空間儲存整張地圖資訊，地圖的地面資料也是透過一張 Blend Map 儲存。

透過一張 Blend Map 來儲存對應地圖位置上使用材質資訊，就能夠透過小張的材質 Texture 繪製出大張的地圖。好處就和物件筆刷一樣，與預先化好整張地圖相比，Blend Map 和獨立的 Texture 都不需要用到太誇張的解析度，也不用擔心放大時的細節失真問題。

材質混合比較常見的作法是通過一張 Texture 的 RGBA 四個通道來表示五種不同材質。
而通道的權重 (0~1) 也代表該處會做多少程度的透明混合，0.5 就是和上層各一半，1 就是完全覆蓋。

{{< resources/image "terrain-brush-1.jpg" "80%" >}}

這是有效也比較直觀的作法，但也有幾個弊端。首先無論繪製位置上實際用到的材質有幾種，都必須要對 Blend Map 的所有通道採樣後，才能得出最後的混合成果。假設混合權重為 (1,0,0,0)，即使最終只會繪製出一種材質，但仍須對權重為 0 的通道進行採樣，會造成許多的無意義運算。

而且這種作法也有材質數量的限制，假設我需要 5 種以上的材質，就必須使用另外一張 blend map 來儲存資訊。

總之，基於以上原因我決定用不同作法來搞材質混合，剛好之前有看到過資料，所以沒花太多時間在研究上。混合材質可以透過 R 和 G 通道紀錄要使用的材質，再透過 B 通道紀錄前兩種材質的混合權重。

具體作法是如何呢，如何透過 R, G 通道紀錄我要使用的材質？很簡單，只需要將所有材質除存為陣列，並將陣列的「索引」壓縮進色彩空間的 0~1 範圍。著色計算判斷要繪製的材質時，再將 R, G 通道的色彩值放大回整數的索引，訪問陣列中要使用的材質資訊即可。

```hlsl
int getIndex(float value, float split)
{
    return ceil(value * _ArraySplit);
}
```

成果，透過修改 R 值繪製不同的材質

{{< resources/image "terrain-brush-2.gif" "80%" >}}

至於材質混合就是透過 lerp 插值而已，把 B 通道作為兩個材質的插值權重。

{{< resources/image "terrain-brush-3.gif" "80%" >}}

如此一來就能避免多餘的著色計算，每次繪製只需要進行兩次 Blend Map 和材質的採樣。
而且訪問材質是透過索引進行的，使材質數量不會對效能產生太大的影響，也幾乎沒有材質的數量上限。

除此之外，也能讓不同材質根據需求使用各自的 Tiling 大小，同樣透過陣列訪問。（那個 Rnd 無關先不要理）

```hlsl
float2 ceilUV(float2 worldPos, float4 ceilOption)
{
    worldPos = worldPos * ceilOption.xy;
    float2 coord = floor(worldPos);

    float rotateRnd = rnd2to1(coord) * 360 * ceilOption.z;
    float randomCeil = rnd2to1(coord) * 0.3;

    float2 uv = fmod(worldPos, 1);
    uv = rotateUV(uv, rotateRnd); 
    
    return uv;
}
```

{{< resources/image "terrain-brush-4.jpg" "80%" >}}

唯一的缺點就是任意位置只能混合兩種材質而已，要再混合就得建立其他渲染圖層去疊。

## 感謝閱讀

接下來就是要把這些系統工具化，雖然現在功能有了，但用起來還是很不方便。所以要補上能從 Editor 編輯的版本，還有 Custom Editor 界面。

{{< resources/image "result-3.gif" "80%" >}}

這兩篇文章的原始碼就不方便提供了，因為是在我進入大學以前時的工作內容，所有權歸前公司。至於後續內容因為公司當時的方針加上現在自身的時間考量，所以決定不繼續寫了。

### 參考資料

[CopyTexture](https://ref.gamer.com.tw/redir.php?url=https%3A%2F%2Fdocs.unity3d.com%2FScriptReference%2FGraphics.CopyTexture.html)

[ImageConversion](https://ref.gamer.com.tw/redir.php?url=https%3A%2F%2Fdocs.unity3d.com%2FScriptReference%2FImageConversion.html)

[Graphics Command Buffers](https://docs.unity3d.com/ru/2018.4/Manual/GraphicsCommandBuffers.html)

[Using texture arrays in shaders](https://docs.unity3d.com/2020.1/Documentation/Manual/SL-TextureArrays.html)

[大地圖多筆刷需求的解決方案](http://makedreamvsogre.blogspot.com/2021/08/blog-post.html)
