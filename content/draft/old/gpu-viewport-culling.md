---
title: "【日誌】批量繪製物件與視錐裁剪"
date: 2022-02-19
lastmod: 2023-02-07

draft: true

description:
tags: [shader, compute-shader]

socialshare: false

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!-- https://home.gamer.com.tw/creationDetail.php?sn=5392211 -->


工作的部分開始需要著色器知識了，主要是地圖場景相關的東西，而我的任務就是想辦法在引擎裡達成美術要求。我們遊戲的地圖邏輯是網格狀的，意思是玩家只能在地圖的棋盤格上移動。既然如此，實現地圖視覺的作法大致有兩種。

<!--more-->

1. 透過 Tile map 繪製地圖，經濟實惠但缺乏精美度，會感受到明顯的棋盤格。

2. 透過擺放樹木、草、石頭等元素建構出整張地圖，工作量高但精美度也會顯著提升，通常複雜的地圖設計都會用這種方式搭建，無論 3D 或 2D。

討論過後，為了達成更高的精美度，我們決定使用第二種方式搭建場景。雖然說要手工搭建場景，但也不可能真的一棵棵草去用手種，所以我的工作就是想辦法減低這種繁瑣作業的工作量。

## 成果展示

https://i.imgur.com/dv1Wagc.gif

而多虧了上個月去拜訪了那位技美前輩，學到不少東西，所以很快就想到 GPU Instance 這項技術了。這篇的內容就是這周嘗試實現技術的學習過程。學藝不精，如果內容有誤或有任何建議再麻煩各位指出。

### GPU Instance

任何的遊戲物件，如果要讓顯示在你的螢幕上，都得要先經過渲染管線 (rendering pipleline) 渲染。將各種物件資料 CPU 傳遞到 GPU 上，並進行系列的座標轉換與著色計算。

假設我們要渲染一個物件，大致需要傳遞三項資訊：模型資料（這個物體的形狀長怎樣）、材質資料（這個物體起來怎樣）與矩陣資料（這個物體的線性轉換）。而在電腦的世界中，模形是透過數個三角面建構而成的，也因此在三者之中最大的資料量也是來自模型。

https://e7.pngegg.com/pngimages/516/482/png-clipart-stanford-bunny-polygon-mesh-computer-science-computer-graphics-rabbit-rabbit-3d-computer-graphics-mammal.png

假設這裡有「一個」四邊形的面，它就有四組頂點座標，與建構表面的六個索引值。

https://i.imgur.com/OjrlKcc.jpg

(圖片來自 MESH GENERATION in Unity - Basics)

而一個完整的 3D 模型可能有百至萬個三角面，可想而知這也會是一個不小的資料量。與之相比，要描述一個物體在空間中的的位移、旋轉與縮放，只需要 4x4 的齊次座標矩陣即可。

https://openhome.cc/Gossip/ComputerGraphics/images/homogeneousCoordinate-1.jpg

所以光是傳遞一個模型的所有頂點資料，其成本就足夠我們傳遞超過數千個物體的線性轉換狀態。再加上 CPU 和 GPU 之間的資料傳遞成本偏高，如果每畫一棵樹就重新傳遞整個頂點資料太浪費了。

於是一種優化方式 "GPU Instance" 便出現了，它的核心概念在於重複使用頂點與材質資料，只透過不同的矩陣資料來複製出一堆物件。簡單來說就是，只傳一次頂點和材質，然後傳一大堆矩陣來畫出一堆物體。

在 Unity 裡面達成 GPU Instance 有兩種作法，第一是透過 Material 的設定控制，只要把材質選項打勾勾引擎就會幫你完成了。簡單，但操作性低。

https://i.imgur.com/OEgqer8.jpg

第二是透過 C# Unity 的 Grpahics API 手動調用繪製功能。也不算複雜，只需要傳遞上面說到的三項資訊而已。

Graphics.DrawMeshInstanced();
請看，一口氣繪製一千個物件

https://i.imgur.com/KJUSs7o.jpg

（更高也不是問題，但是 DrawMeshInstanced 的單次傳遞上限為 1023，我懶的拆陣列了 :P）

實做上這裡得稍微修改材質 Shader，但我先省略了，詳見文檔。

[Creating shaders that support GPU instancing](https://docs.unity3d.com/2021.2/Documentation/Manual/gpu-instancing-shader.html)

### 視錐裁剪

雖然免除了傳遞頂點資料的成本，但 GPU Instance 有個問題就是它一次就得畫出「太多」東西了，包括那些根本不會被玩家看到的物件。這些物件在管線中還是得做著色計算，顯然花費計算成本在根本不會被看到的物件是很浪費的。

https://i.imgur.com/7JJXlLx.jpg

為了優化這點，通常在進行著色計算之前都會先檢查物件是不是在視線範圍中，也就是所謂的「視錐裁剪」。

https://i.imgur.com/L36tPh1.png

通常情況下，剔除作業可能會在 CPU 中執行，透過一些如四叉、八叉樹的結構去排序物件，優化剔除效率。但當物件量大到一個程度後，即使透過資料結構優化可能也不夠，於是目光又回到了 GPU 上。

Compute Shader 是一種獨立於渲染管線的特殊著色器，需要使用 C# 調用執行，用於並行處裡某些任務。而在這裡這裡他的任務就是要透過並行的威力，一口氣完成所有物體的裁剪判斷。

裁剪判斷就是透過一個粗略表示物件大小的矩形 (bounding box) 來檢測頂點是否再視錐範圍裡，如果所有頂點都在視錐之外就代表這個物件不可能被看到，要將其剔除。至於實際的判斷嘛...因為我們遊戲是純 2D 的，所以只需要使用兩個向量表示物件範圍，兩個向量表示視錐範圍就好 :P

https://i.imgur.com/THjRWuv.jpg

成果圖，可以看到現在只有視線範圍中的物件會出現。

https://i.imgur.com/dv1Wagc.gif

同樣這裡省略了很多實做內容，詳見參考資料，補充在最下方。

還好專案是 2D 的，所以實做起來輕鬆很多？

https://cdn2.ettoday.net/images/3420/d3420288.jpg

### 繪製順序

2D 還是會有 2D 的問題，嘗試接手引擎部份工作就代表許多任務也落到自己手上了。這裡的任務主要是透明度與深度排序的問題，常規的 Sprite Shader 寫法在這裡不管用

https://i.imgur.com/H9csSHT.gif

如果有寫過 Unity Sprite Shader 的人應該知道，為了讓 2D 物件正確渲染，通常是必須把物件的深度寫入 (ZWrite) 關閉的。說實話我之前就很納悶為什麼關閉之後 2D 的 z 軸深度還是有效的，剛好這次遇到就深入研究了一下。

https://i.imgur.com/Sdkd5Ld.gif

我用 Frame Debugger 細看後才發現是 Unity 會偷偷幫我們排序好渲染順序，讓不同物件根據深度由好幾個 DrawCall 去繪製。難怪 Sprite Sahder 能夠被正確繪製...真的是學越深才越了解遊戲引擎是多偉大的發明。

現在我能理解前輩告訴我的「制定和管理渲染流程」是什麼意思了

這也是為什麼我把 GPU Instance Shader 的 ZWrite 關閉後會發生這種閃爍現象。沒有深度資訊的話代表晚畫內容的一定會覆蓋先前的東西，而且 GPU Instance 讓所有物件都在同個 DrawCall 中繪製。由於 GPU 的（並行）繪製物件是是亂序的，最晚畫的物件每次的都不同，就會產生了這種隨機的閃爍。

https://i.imgur.com/H9csSHT.gif

如果將深度寫入開啟的話，但又會遇到另一個問題是 2D 平面沒有深度。意思是，雖然繪製時有深度寫入，但這些物件實際上還是沒有正確的深度資訊。

這裡的「正確」指的是高度，以我們遊戲的視角來說 y 軸越高代表物件在越遠處，要是沒有深度可能就會導致後面的樹把前的樹蓋住（還有閃爍會保持）。

https://i.imgur.com/fVTdNm3.jpg

修正這點的話，基本上就是把從物件添加一個隨著 y 軸上升增加的 z 軸斜率，這樣渲染時就會有正確的深度資訊了。

https://i.imgur.com/aWFD5T2.jpg

粗暴但有效，而且也能和其他場景物件產生正確的前後關係。

https://i.imgur.com/AEW9rXB.jpg

說真的這也是我現在能想到比較實際的作法了，如果不這樣就得真的和 unity 一樣搞多個 Draw Call 去排序。那基本上也等於要親自管理整個地圖場景的渲染了，不太實際

### 透明度問題

另一個 2D 會遇到的問題就是透明度。2D 物件通常是由單張圖片構成的，透過圖片的透明度來表示出實際輪廓。

https://i.imgur.com/vYJIxwY.jpg

但由於 Draw Call 中亂序執行，以及 FrameBuffer 還沒有色彩資訊的問題，導致 Alpha Blend 沒辦法正確運作，讓閃爍再次發生。

文檔裡面也有說到了 GPU Instance 不支援透明著色
Note that after culling and sorting the combined instances, Unity does not further cull individual instances by the view frustum or baked occluders. It also does not sort individual instances for transparency or depth efficiency.

所以為了防止圖片的透明區快被畫出來，只能透過 clip 函式直接將透明位置的像素處裡掉，關閉 Blend 。雖然有效，但是想讓圖片有半透明效果就無法ㄌ...

https://i.imgur.com/xykpVCX.jpg

其實我有嘗試過多 DrawCall 的作法啦，只要確保每次繪製的時候沒有物件重疊就好。雖然深度和透明混和效果是理想的，但要建一大堆  ComputeBuffer  有點可怕。我也還不清楚 Compute Shader 的一些細節，所以不敢實際使用這種方法，怕有什麼後遺症

https://i.imgur.com/Jmh8I89.gif

### 閃爍問題

ComputeShader 導致的閃爍
製作過程中遇到的奇怪問題，只要資料經過 ComputeShader 以後，渲染物件時就會不時發生奇怪的閃爍。這個問題卡了我快一週，也不是深度或透明度的問題。為了檢查是不是剔除判斷錯誤我也先關了，但還是會發生。

https://i.imgur.com/HYUpEgc.gif

後來才發現是 ComputeShader 的物件數量判斷沒擋好
    if(id.x > instanceCount) return;

我忘了反寫數量判斷的時候 < 要變 >=
    if(id.x >= instanceCount) return;

因為這個錯誤，導致輸入進管線的矩陣資料數量也出錯，才發生這種閃爍。
哭阿找超久的，單看描述可能像是我卡一個很蠢的問題卡很久（雖然真的是很蠢的問題），但 Compute Shader 真的超難 debug 的。它同時跨了兩種個設備和語言，而且兩者的運作原理也天差地遠。

出錯的時候問題可能在 C# 程式本身沒寫好、C# 資料傳遞沒寫好、Shader 資料接收沒寫好，或是 Shader 程式本身沒寫好。翻遍資料傳遞的部份也地方找不出原因，結果問題出在 Shader 程式本身 D:

### 分佈繪製

雖然我讓 GPU Instance 生出了一大堆物件，但場景中不會真的需要那麼多，總不能讓道路上也長滿雜草吧？因此也需要有個手段來控制繪製物件的範圍。這裡的作法就是使用 Visible Map，透過一張灰階的 Texture 來表示物件的分佈狀態，如此一來在繪製地圖時也能更方便修改。

https://i.imgur.com/6VUEdrM.jpg

至於黑到白之間的過度就是物件的稀疏度

https://i.imgur.com/ToNQLMp.jpg

難度不高，基本上就是把物件的世界座標映射到 0~1 的 UV Space 就好，簡單的矩陣計算。

唯一遇到的問題就是 Compute Shader 讀取 texture 時是透過像素座標讀的，而非一般 Tex2D 是透過 uv 座標採樣的。所以還要把 uv 還得乘上圖片解析度，那時也是找半天找不出 bug。

## 感謝閱讀

就醬，這陣子又累積的不少資料，找時間會再整理一下 shader 資源那篇文

https://i.imgur.com/oaE4qLK.gif

### 參考資料

[Creating shaders that support GPU instancing](https://docs.unity3d.com/2021.2/Documentation/Manual/gpu-instancing-shader.html)

[Unity中ComputeShader的基础介绍与使用](https://zhuanlan.zhihu.com/p/368307575)

[Unity中使用ComputeShader做视锥剔除（View Frustum Culling）](https://zhuanlan.zhihu.com/p/376801370)
