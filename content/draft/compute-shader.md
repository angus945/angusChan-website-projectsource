---
title: "筆記 計算著色器"
date: 2022-05-14T17:12:03+08:00
lastmod: 2022-05-14T17:12:03+08:00

draft: false

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
listable: [recommand, new, all]
---

計算著色器學習筆記

不夠直觀

以自己的理解解釋一次計算著色器

<!--more-->
<!-- 
以下以 C# 代表 CPU 語言

以 HLSL 代表 GPU 語言

以 Unity 中的 Compute Shader 為主 -->

## 概括 -

計算著色器 (Compute Shader) 是一種位於於渲染管線之外，用途也不僅限於著色計算的獨立工具。

透過 GPU 並行來 解決問題

大致有兩項重點： <h> 並行運算 </h> 與 <h> 資料傳遞 </h>

### 並行運算 -

著色器是由 GPU 並行進行計算的，
由於目的不同 而產生不同的架構
運作原理也相異


以重複執行函式為例子，在 CPU 語言中會透過迴圈執行。假設要執行某項函式 10 次，迴圈將會從 index = 1 到 10 依序線性執行，只有當前的迴圈內容被完整執行完後，才會進入下一次的迴圈。

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction(i);
}
SomeFunction(int index) 
{ 
    //DoSomething
}
```

而在著色器這種 GPU 語言中，則會交由十個獨立的執行緒 (thread) 獨立運作，讓 GPU 的大量核心以並行的方式完成任務，執行時並無順序之分（亂序）。

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

這裡用一張簡單的示意圖展示運作差異（注意和運行速度無關）

<!-- TODO 示意圖 -->

如果有編寫過材質著色器的話，運作差異就不是真正的難點了。

不過在計算著色器中，單純的運作差異並不是真正的難點。

由於計算著色器是獨立於渲染管線之外的系統，因此使用者對其有完整的控制權，但少了渲染管線的

但與渲染管線中的 vertices, fragment shader 不同，

也意味著我們必須自己判斷有什麼問題是 <h> 能透過並行解決的 </h> ，以及 <h> 該怎麼透過並行解決問題 </h>。

剛開始比較會遇到不知道如何編寫 

### 資料傳遞 -

計算著色器的第二項重點：資料傳遞。

通常情況下引擎的管線會幫我們處理完

但同樣的，更大的權力代表更大的責任，在計算著色器中這些分配資源的工作也落到我們手上了。

資料從哪裡來、資料到哪裡去，該傳遞什麼資料以及該怎麼傳遞資料

實做上比較容易遇到問題的部份

與 C# 端的主要交界處

資料傳遞的限制也是 優化

## 腳本結構 +

這是 Unity 中的預設 Compute Shader 腳本，這個章節就來逐步解析他的結構

```hlsl
// Each #kernel tells which function to compile; you can have many kernels
#pragma kernel CSMain

// Create a RenderTexture with enableRandomWrite flag and set it
// with cs.SetTexture
RWTexture2D<float4> Result;

[numthreads(8,8,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

### 計算核心 +

和名稱一樣，計算核心 (Kernel) 是計算著色器中的核心區塊，著色器的具體功能會在此處定義。透過 `#pragma kernel ___` 關鍵字宣告計算核心，就和 vert 和 frag 編寫時一樣，核心的名稱可以自由定義，但一定要有一個對應的函式實做才能運行。也可以根據需求定義一個以上的核心。

```hlsl
#pragma kernel MyComputeKernelA
#pragma kernel MyComputeKernelB
#pragma kernel MyComputeKernelC

void MyComputeKernelA (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelB (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelC (uint3 id : SV_DispatchThreadID) { }
```

### 執行緒 +

並行便是由多個執行緒（或線程）

因此除了定義計算核心外，還需要透過 `[numthreads(x, y, z)]` 分配這個核心需要的執行緒數量 "num" "threads"。三個欄位分別代表維度軸 `xyz`，而計算著色器運作時也會透過 `SV_DispatchThreadID` 當前的執行緒 ID 傳入計算函式中。

```hlsl
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```

轉換成 CPU 語言中的迴圈看起來應該會更直觀。但請注意！這只是比喻，計算著色器中不會真的像迴圈那樣跑，而是以並行的方式亂序執行，別忘了最一開始的示意圖。

```cs
Vector3 numthreads = new Vector3(10, 1, 1);
void Threads()
{
    for(int x = 0; x < numthreads.x; x ++)
    {
        for(int y = 0; y < numthreads.y; y ++)
        {
            for(int z = 0; z < numthreads.y; z ++)
            {
                CSMain();
            }
        }
    }
}
void CSMain() 
{ 
    // TODO: insert actual code here!
}
```

至於為什麼會執行緒的數量需要三個維度軸呢？Microsoft 官方文檔是這樣說的：[numthreads](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

> For example, if a compute shader is doing 4x4 matrix addition then numthreads could be set to numthreads(4,4,1) and the indexing in the individual threads would automatically match the matrix entries. The compute shader could also declare a thread group with the same number of threads (16) using numthreads(16,1,1), however it would then have to calculate the current matrix entry based on the current thread number.

簡單來說就是為了「方便」，視你要處裡的資料結構而定，多的維度軸可以幫使用者省去轉換工作，讓 ID 與資料欄位直接對應。在 CPU 語言中，如果要遍歷具有座標性質的資料時（如二維陣列 `int[,]`），透過兩層迴圈對應維度的 x, y 軸會更加輕鬆。

當然並行時也同理，假如我現在要處裡的是圖片資料，透過兩個維度軸直接對應至像素位置上，會比透過長寬換算來的方便，這就是為什麼計算著器起也允許分配多個軸向的執行緒數量。

### 執行緒組 +

即使定義了計算核心，Compute Shader 還是需要由使用者手動呼叫 [ComputeShader.Dispatch](https://docs.unity3d.com/ScriptReference/ComputeShader.Dispatch.html) 執行。

```cs
public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 
```

第一個變數 `kernelIndex` 代表的是這次 Dispath 要使用的計算核心，如果著色器中有定義複數的核心，便可由這裡進行選擇。可以使用 `FindKernel` 函式透過名稱尋找計算核心。

```cs
int knrnelIndex = compute.FindKernel("MyComputeKernel");

compute.Dispatch(knrnelIndex, 1, 1, 1);
```

Dispatch 還有三個輸入 `threadGroupsX,Y,Z`，意思這次運行是要分配的「執行緒組」數量 "thread" "Groups"（下面簡稱 "組"）。numthread 分配的是一個組裡面要有多少執行緒，而 threadGroups 則會指定一共使用多少組來運行，所以一次運行的最終次數便是 threadGroups * numthreads。

同樣，替換 CPU 語言中的迴圈看起來會更直觀。但也再次提醒，這只是比喻，別忘了一開始的對比圖。並且組和組之間也會並行，並非上一個組完成才會進入下一個組。

```cs
void ThreadGroups(int threadGroupsX, int threadGroupsY, int threadGroupsZ)
{
    for(int x = 0; x < threadGroupsX; x ++)
    {
        for(int y = 0; y < threadGroupsY; y ++)
        {
            for(int z = 0; z < threadGroupsZ; z ++)
            {
                Threads();
            }
        }
    }
}
void Threads() { }
void CSMain() { }
```

每個執行緒的 SV_DispatchThreadID 便是當前的組 * 執行緒數量 + 當前的執行緒，不過這些 ID 的計算 Compute Shader 都會幫我們完成，所以使用者只要分配好需要的數量即可。

至具體數量該怎麼分配呢？首先從處理資料的維度下手，如果是一維的資料陣列就分配 `(n, 1, 1)`、二維圖片的像素陣列就用 `(x, y, 1)`、三維的體積網格就 `(x, y, z)`。

執行緒的具體數量或比例則沒有明確規則，大概抓個資料總數 1% 吧？假設陣列長度大約一萬上下，numthread 就分配為 `(100, 1, 1)`、圖片大小 2048 的話就分配 `(20, 20, 1)`。

最後，組的數量可以透過資料長度除以執行緒數量得出，確保任何情況下都能分配足夠的組來運行著色器，畢竟資料的長度不一定是固定的。

```cs
compute.Dispatch(knrnelIndex, array.Length / 100, 1, 1);
compute.Dispatch(knrnelIndex, image.width / 20, image.height / 20, 1);
```

著色器中訪問陣列時，不會因為 index out of range 出現錯誤而中斷，所以只需要確保分配的數量足夠即可，即時稍微超出需求也沒關係。（除了少數情況會真的遇到問題，後面會講防呆處置）

<!-- out of bound 時的行為 ? -->

<!-- https://github.com/gpuweb/gpuweb/issues/35 ? -->

### 訪問資料 +

要透過計算著色器處理的資料主要會透過 Buffer 傳遞至 GPU，而存取 Buffer 資料的方法就和陣列一樣，透過索引值訪問特定欄位中的資料。透過執行緒 ID 對應至圖片的每個像素，並將黑色寫入像素。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void ClearImage (uint3 id : SV_DispatchThreadID)
{
    Image[id.xy] = float4(0, 0, 0, 1);
}
```

當然資料訪問也不僅限於自己的 ID，視需求也可以讀、寫其他欄位上的資料。例如時常應用在影像處裡中的卷積矩陣 (Kernel Convolution)，就會訪問周圍的像素資料來進行計算。下面是方框模糊的範例程式，將像素與周圍八格進行平均。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void BoxBlur (uint3 id : SV_DispatchThreadID)
{
    float4 color = 0;
    for(int x = -1; x <= 1; x ++)
    {
        for(int y = -1; y <= 1; y ++)
        {
            color += Image[id.xy + float2(x, y)];
        }
    }
    
    Image[id.xy] = color / 9;
}
```

## 資料傳遞 -

GPU 運算 使用的是 GPU 緩衝

而非 CPU 的記憶體或快取

兩者是不能直接互通的，而且傳遞成本是一個注意事項

因此任何資料操作都需要先傳遞至 GPU

### 只讀參數 +

就和一般的渲染著色器一樣，計算著色器也可以傳入個別的參數用於計算。且同樣的，這些數值會被整個著色器共享（包括不同的計算核心），並且只讀。通常用於傳遞全域的屬性參數，如圖片大小、筆刷位置、顏色等。

```cs
compute.SetVector("_Resourection", resourction);
compute.SetVector("_BrushPos", mousePosition);
compute.SetVector("_BrushColor", color);
```

```hlsl
float2 _Resourection;
float2 _BrushPos;
float4 _BrushColor;
```

### 緩衝資料

也是計算著色器的主要目的

Buffer 有許多種類型 

<!-- https://docs.unity3d.com/ScriptReference/ComputeBufferType.html -->

這裡就先把重點放在幾個常用的上面

```hlsl
StructuredBuffer<T>

AppendStructuredBuffer<T>

RWStructuredBuffer<T>
```

分配 GPU 空間
陣列長度，元素大小 `sizeof()`，型別

```cs
ComputeBuffer buffer = new ComputeBuffer(count, stride, ComputeBufferType);
```

將一個長度為 10000 的 vector 陣列傳入

```cs
Vector3[] positions = new Vector3[10000];

buffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Structured);
buffer.SetData(positions);
```

這只是分配空間而已，如果要讓著色器使用還要指定給他 指定給要使用的計算核心

```cs
compute.SetBuffer(kernel, name, buffer);
```

一個 Shader, Kernel 一樣也能使用複數的

主要是 ComputeBufferType.Structured, ComputeBufferType.Append 

對比圖

### 貼圖

`Texture2D<T>` 只讀 可以接收 Unity Texture, Texture2D

`RWTexture2D<T>` ; 讀寫 只接收 RenderTexture 
因為分配的空間的問題 (?

T 為通道數以及精度 float, fixed4

RW 

Compute Shader 不接受 sampler2D, 無法使用 Tex2D 採樣
(已確認)

訪問時是直接透過 像素 位置訪問圖片的二維像素陣列

不確定會不會受 filter mode, mipmap 的引響? 



### 結構資料

能夠將資料包裝成 Struct 記得要分號

```hlsl
struct transform
{
    float3 position;
    float3 rotation;
    float3 scale;
};

StructuredBuffer<transform> Transforms;
```

C# 傳遞相同大小的資料進去



## 實作 範例

傳遞資料並拿回

傳遞資料並直接進渲染管線

GPU Instance, Culling

Animation Instance

要做的事、要傳遞的資料、要執行的方法

### 陣列計算

要解決什麼問題：將陣列中每個元素的數值 + 10
要怎麼解決問題：以多個 thread 對應到陣列的所有元素上，並各自執行 +10 的動作

資料從哪裡來：C# (CPU) > ComputeShader (GPU)
資料到哪裡去：ComputeShader (GPU) > C# (CPU)

要傳遞什麼資料：C# int array
要怎麼傳遞資料：RWStructuredBuffer

### 資料過濾

### 影像處裡

### 粒子模擬

### Culling

## 結尾

參考資料

https://docs.microsoft.com/zh-tw/windows/win32/direct3dhlsl/sm5-attributes-numthreads
