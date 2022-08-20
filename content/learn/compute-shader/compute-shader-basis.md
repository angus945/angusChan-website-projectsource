---
title: "【筆記】初學指南，計算著色器"
date: 2022-06-03
# lastmod: 2022-05-14

draft: false

description: 計算著色器初學指南
tags: [computeShader]

## image for preview
# feature: "/learn/shader/compute-shader-basis/thread-group-id.jpg"

## image for open graph
og: "/learn/compute-shader/compute-shader-basis/thread-group-id.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/compute-shader/compute-shader-basis/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, new, all]
---

## 概括

計算著色器 (Compute Shader) 是一種獨立於渲染管線之外，用途也不僅限於著色計算的工具， <h> 意圖利用 GPU 擁有大量核心的優勢，以平行運算的方法解決問題 </h> 。這篇文章是我在研究一段時間後總結出的各項初學重點，在這裡分享給各位。

<!--more-->

請注意，因為計算著色器已經屬於進階應用，所以 <h> 文章將會省略基礎的著色器知識 </h> ，將重點放在「對圖學與著色器有一定程度理解，但還不知道如何接觸計算著色器」的角度進行編寫。

本文的內容一共用到兩種程式語言，由 CPU 運作的 C# (CSharp)，以及由 GPU 運作的 HLSL (High Level Shader Language)，閱讀程式時還請注意程式區塊的標題。文章範例使用的環境為 Unity 引擎，雖然著色器相關的內容大致是通用的，但實做時也請注意是否有環境差異的問題在。

那麼，正式開始前請先讓我介紹一下計算著色器的兩大重點：

### 並行運算

首先，假設我們想重複執行某項函式 10 次，在常規的 CPU 語言中可能會透過迴圈執行，根據給定的條件（如計數器）重複執行任務。以現在的例子便是根據執行次數 `i`，由 0 開始直到執行完第 9 次後結束，且由於 CPU 語言是線性執行的，因此 <h> 只有在當前迴圈的內容被執行完畢後，才會進入下一次的迴圈 </h> 。

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

但是在著色器這種 GPU 語言中，函式則會交由十個獨立的執行緒 (thread) 進行運算，讓 GPU 的大量核心 <h> 以平行的方式完成任務 </h> ，執行時並 <h> 無順序之分（亂序）</h>。

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

這裡用一張簡單的示意圖展示運作差異。注意，這張圖只是表示兩者「運作方式的差異」，與處理效率無關。

{{< resources/image "cpu-vs-gpu.gif" "90%" >}}

不過，在計算著色器中，運作差異並不是真正的難點，對有編寫過材質著色器的人來說應該已經很熟悉並行這回事了。計算著色器與材質著色器的真正差異在於，計算著色器是 <h> 獨立於渲染管線之外的系統 </h> ，所以它也沒有頂點著色器 (vertices shader) 或片段著色器 (fragment shader) 這種渲染管線提供的「框架」來提示使用者該做些什麼。

因此計算著色器的真正的難點是，在少了明確的目標指引以後我們只能靠自己判斷 <h> 有什麼問題是能透過並行解決的 </h> ，以及 <h> 該怎麼透過並行解決問題 </h> 。對初次接觸計算著色器的人來說，就可能因為不熟悉並行的思考方式而停頓。

### 資料傳遞

在常規的渲染著色器中，引擎管線會幫使用者處理完各種瑣碎的工作。但在計算著色器中，使用者擁有更大的權力指揮 GPU 幫助我們達成各種任務，因此相應的責任也產生了，我們必須 <h> 接手一些原本會由渲染管線完成的工作：資料傳遞 </h>。

CPU 與 GPU 運作時使用的儲存空間不同，因此想執行任何的操作前也必須先將資料傳遞給 GPU。由於資料是在兩種不同環境中進行傳遞， <h> 資料從哪裡來 </h> 、 <h> 資料到哪裡去 </h> ，該 <h> 傳遞什麼資料 </h> 以及該 <h> 怎麼傳遞資料 </h> 都是實做時需要面對的問題。

再加上著色器本身的除錯難度，計算著色器出錯時會讓使用者難以辨識究竟是資料傳遞出錯還是計算函式有誤。對於初次接觸計算著色器，還不熟悉除錯方法的新手來說也會是一大學習瓶頸。

## 腳本結構

以下是 Unity 中的預設 Compute Shader 腳本，這個章節就來逐步解析他的結構，了解一個完整的計算著色器是由哪些元素構成的。

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

### 計算核心

就如同名稱一樣，計算核心 (Kernel) 是計算著色器中的核心區塊，當執行計算著色器時， <h> 其中的程式便會透過並行的方式運行 </h>。

著色器需要透過 `#pragma kernel ___` 宣告計算核心，就和宣告材質著色器的 `vert` 和 `frag` 一樣。計算核心的名稱可以自由定義，但 <h> 一定要有一個對應的函式實做 </h> 才能運行。計算著色器也可以根據需求定義多個計算核心。

```hlsl
#pragma kernel MyComputeKernelA
#pragma kernel MyComputeKernelB
#pragma kernel MyComputeKernelC

void MyComputeKernelA (uint3 id : SV_DispatchThreadID) 
{ 
    // TODO: insert actual code here!
}
void MyComputeKernelB (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelC (uint3 id : SV_DispatchThreadID) { }
```

### 多執行緒

在定義與實做了計算核心之後，接著便要指定他的 <h> 「執行緒數量」 </h> 。並行是透過將工作分配給多個執行緒達成的，因此除了定義計算核心外，還需要使用 `[numthreads(x, y, z)]` 分配這個核心需要的執行緒數量 "num" "threads"。

```hlsl
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```

`numthreads()` 提供的三個參數輸入分別代表維度軸 `x, y, z`，計算著色器運作時便會透過函式的輸入 `(uint3 id : SV___)` 將執行緒 ID 等資料傳入計算函式中。轉換成 CPU 語言中的迴圈看起來應該會更直觀。

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
                CSMain(new Vector3(x, y, z));
            }
        }
    }
}
void CSMain(Vector3 threadID) 
{ 
    // TODO: insert actual code here!
}
```

但請注意！這只是比喻，計算著色器中不會真的像迴圈那樣跑，而是以並行的方式亂序執行，別忘了最一開始的示意圖。

{{< resources/image "cpu-vs-gpu.gif" "90%" >}}

至於為什麼會需要三個維度軸的執行緒的數量呢？Microsoft 官方文檔是這樣說的：[numthreads](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

> For example, if a compute shader is doing 4x4 matrix addition then numthreads could be set to numthreads(4,4,1) and the indexing in the individual threads would automatically match the matrix entries. The compute shader could also declare a thread group with the same number of threads (16) using numthreads(16,1,1), however it would then have to calculate the current matrix entry based on the current thread number.

簡單來說就是為了「方便」，視你要處理的資料結構而定， <h> 多的維度軸可以幫使用者省去轉換工作 </h> ，讓 ID 與資料欄位直接對應。就像 CPU 語言中，要遍歷具有座標性質的陣列元素時，透過多層迴圈直接對應各個維度軸會更加輕鬆。

當然並行時也同理，假如我現在要處理的是圖片資料，透過兩個維度軸直接對應至像素位置上，會比透過長寬換算來的方便，這就是為什麼計算著色器也允許分配多個軸向的執行緒數量。

### 執行緒組

計算著色器的運行時機是由使用者掌控的，因此在定義完計算核心與執行序數量後，還是需要手動呼叫 `ComputeShader.Dispatch()` 來「運行」計算著色器。

```cs
public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 
```

<p><c> 註：CPU 與 GPU 的運作通常是異步的，因此「通常情況下」計算著色器並不是在使用者調用 Dispatch 的當下就會執行，而是有自己的運行時機在。 </c></p>

<p><c> 註2：我猜測這也是為什麼函式會叫做 Dispatch，而非更直白的 Execute，但我還沒找到「直接」證實這一點的官方文檔，如果我的猜測或描述有誤的話還請各位指正，若有看到相關資料的也麻煩各位提供了 Orz。 </c></p>

`Dispath` 函式一共接受四個參數輸入，第一個 `kernelIndex` 代表的是這次 Dispath 要使用的計算核心，如果著色器中有定義複數的核心，便可藉由 <h> 改變參數切換計算著色器的功能 </h> 。如果要取得計算核心的話，只需要使用 `FindKernel()` 便可透過名稱尋找對應的計算核心。

```cs
int knrnelIndex = compute.FindKernel("MyComputeKernel");

compute.Dispatch(knrnelIndex, x, y, z);
```

至於後面三個參數 `threadGroupsX,Y,Z`，代表的是這次 <h> 運行要分配的「執行緒組」有多少個 </h> （下面簡稱 "組"） "thread" "Groups"。上個部份提到的 `numthread` 分配的是一個組裡面要有多少執行緒，而 `threadGroups` 則會指定一次運行要分配多少個執行緒組。

因此，當計算著色器運行時，最終會執行的次數會有 threadGroups * numthreads 次。同樣，替換 CPU 語言中的迴圈看起來會更直觀。但也再次提醒這只是比喻，而且組和組之間也會並行，並非上一個組完成才會進入下一個組。

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
void Threads() 
{ 
    //for numthread x y z => CSMain()
}
void CSMain() { }
```

每個執行緒的 `SV_DispatchThreadID` 便是當前的執行緒組 * 執行緒數量 + 當前的執行緒，不過這些 ID 的計算系統都會幫我們完成，所以使用者只要分配好需要的數量即可。

{{< resources/image "thread-group-id.jpg" "60%" "圖片引用自 microsoft HLSL 文檔，numthreads" >}}

至具體數量該怎麼分配呢？首先從 <h> 處理資料的維度 </h> 下手，假設著色器要處理的主要數據為一維的陣列就分配 `(n, 1, 1)`，若要對圖片的二維像素陣列操作就用 `(x, y, 1)`，或是要計算三維的體積網格就 `(x, y, z)`。

執行緒的具體數量或比例則沒有明確規則，大概抓個介於 10 和資料總數 1% 以下的數值吧。假設陣列長度大約一萬，numthread 就分配為 `(100, 1, 1)`，若圖片大小 2048 的話就分配 `(20, 20, 1)`。

<p><r>
修正：理想的執行緒組數量應該是介於 32 至 1024 之間，並且為 32 的倍數，似乎與 GPU 的硬體結構有關，資料先補充在文末，細節會等我深入了解後再補上。(感謝巴友 美遊ちゃん 指正)
</r></p>

最後，組的數量可以透過 <h> 資料長度除以執行緒數量 </h> 得出，畢竟資料的多寡可能根據情況產生差異，透過這種方式可以確保 <h> 在任何情況下都有足夠的執行緒進行計算 </h> 。

```cs
compute.Dispatch(knrnelIndex, 1 + (array.Length / 100), 1, 1);
compute.Dispatch(knrnelIndex, 1 + (image.width / 20), 1 + (image.height / 20), 1);
```

並且著色器訪問陣列時不會因為 index out of range 而出誤中斷，所以只需要確保分配的數量足夠即可。
（只有少數情況會因為數量過多導致結果錯誤，文章最後的範例會提到解決方法）

### 資料訪問

最後，計算著色器中最關鍵的部份， <h> 透過並行運算對傳入著色器的資料進行操作！ </h> 如果執行緒的數量分配正確，每個 ThreadID 都會對應到各自的要處理的資料欄位上。

假如我要將一張圖片重置為黑色，只需要透過執行緒 ID 對應至圖片的每個像素，並將黑色寫入像素即可。由於資料的維度為二維，因此訪問資料欄位時的索引輸入也是二維 `Image[id.xy]`。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void ClearImage (uint3 id : SV_DispatchThreadID)
{
    Image[id.xy] = float4(0, 0, 0, 1);
}
```

在每個執行中緒訪問資料也不侷限於自己的 ID，視需求也 <h> 可以讀、寫其他欄位上的資料 </h> 。例如時常應用在影像處理中的卷積矩陣 ([Kernel Convolution](https://en.wikipedia.org/wiki/Kernel_(image_processing)))，就會參考周圍像素的資料來進行計算。下面是方框模糊的範例程式，將像素與周圍八格進行平均。

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

卷積矩陣的簡單範例，分別為無效果、方框模糊與高斯模糊。

{{< resources/image "kernel-convolution-operation.jpg" "80%" "圖片引用自 Kernel Convolution Wiki" >}}

<p><c>
註：當多個執行緒試圖同時讀寫「同個位置上」的資訊時可能會發生數據爭用 (data race) 或競態條件 (race condition) 的情況，但計算著色器似乎能一定程度上預防毀滅性的後果發生，所以不要太過分應該不用擔心？具體狀況我也還沒遇到過，相關參考資料會在文末提供。
</c></p>

## 資料傳遞

資料傳遞，計算著色器的第二項重點。一開始有提到過，CPU 與 GPU 運作時使用的儲存空間不同，因此在計算著色器執行任何的操作前都 <h> 必須先將資料傳遞給 GPU  </h> 才行。這個章節就開始解說計算著色器的各種資料型別，以及如何傳遞資料給計算著色器使用。

### 只讀參數

與一般的渲染著色器一樣，計算著色器也可以傳入單一的參數用於計算。且同樣的，這些數值在整個著色器中是全域共享並且只讀的，包括不同計算核心與函式，通常 <h> 用於傳遞全域屬性與設置類的參數 </h> 。

以繪圖系統為例就是畫布大小、筆刷位置、筆刷強度與顏色等參數。透過 `SetVector()`, `SetFloat()` 等函式進行傳遞。

```cs
compute.SetVector("_CanavsSize", canvasSize);
compute.SetVector("_BrushPos", mousePosition);
compute.SetFloat("_Intensity", intensity);
compute.SetVector("_Color", color);
```

要使用這些參數的話，在著色器中也需要建立對應名稱的變數接收。

```hlsl
int2 _CanavsSize;
float2 _BrushPos;
float _Intensity;
float4 _Intensity;
```

### 緩衝資料

與只讀的全域參數不同，由於儲存空間的差異以及資料傳遞的成本，若想讓計算著色器 <h> 對資料內容進行操作  </h> ，或是想 <h> 傳遞大量的獨立參數供執行緒個別使用 </h> 的話，就必須事先對 GPU 的儲存空間進行分配。

GPU 的資料儲存空間為緩衝區 (Buffer)，在 Unity 中只需要透過 `new ComputeBuffer()` 即可建立一個新的 GPU 緩衝區，引擎會幫我們完成繁瑣的內部作業。

```cs
ComputeBuffer buffer = new ComputeBuffer(count, stride, ComputeBufferType);
```

計算緩衝區的建構子需要接收三個參數輸入，第一個 `count` 代表緩衝區「最多」需要儲存多少元素，通常就是我們想傳遞的 <h> 陣列資料的長度 </h> 。`stride` 為一個欄位的元素大小，通常就是想傳遞的 <h> 陣列資料的型別 </h> ，可以透過 `sizeof(type)` 取得。

而最後的 `ComputeBufferType` 則是緩衝區的類別，可以根據需求使用不同的類型。具體的類型有許多種，不過這裡先關注最常用的兩種即可：

+ **ComputeBufferType.Structured**  
    結構緩衝區，通常用於 <h> 傳遞一般的陣列資料 </h> ，讓計算著色器讀、寫其中的內容。

+ **ComputeBufferType.Append**  
    容器緩衝區， <h> 允許計算著色器對它「添加」元素 </h> ，通常用於資料過濾。

假設我要將一個長度為 10000 的向量陣列傳入計算著色器，並對裡面的元素進行過濾的話，就會需要一個結構緩衝區與一個容器緩衝區，元素數量與陣列相同 (10000)，元素大小為三個單精度浮點數。

```cs
Vector3[] positions = new Vector3[10000];

sourceBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Structured);
filteBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Append);
```

分配完儲存空間後，還需要 <h> 透過 `SetData()` 將想傳遞的資料存入緩衝區 </h> 當中。

```cs
sourceBuffer.SetData(positions);
```

最後，只需要 <h> 將緩衝區指定給計算著色器 </h> ，就能讓他在運行時使用這些資料了，不過與先前的只讀參數不同，緩衝資料需要指定一個目標的計算核心。不太需要擔心指定緩衝區的開銷，因為在 `SetData()` 的時候資料傳遞就已經完成了，這裡只是 <h> 改變計算著色器中指向緩衝區位置的指標 </h> 而已。

```cs
compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "filteBuffer", filteBuffer);
```

計算著色器也需要對應的緩衝區變數接收才能使用這些資料。建立時需要透過 `<T>` 欄位指定資料型別，型別必須與建立緩衝區時的分配的元素大小 `stride` 一致。

```hlsl
StructuredBuffer<float3> sourceBuffer;
AppendStructuredBuffer<float3> filteBuffer;
```

若想讓緩衝區一次傳遞複合資料，也可以透過結構包裝多個變數。

```hlsl
struct transform
{
    float3 position;
    float3 rotation;
    float3 scale;
};

StructuredBuffer<transform> transforms;
```

除此之外，結構緩衝區還有一種 `RWStructuredBuffer<T>`，這種緩衝區會 <h> 允許計算核心將資料寫入緩衝區 </h> ，視需求使用。

### 貼圖資料

除了傳遞一維陣列的緩衝區以外，計算著色器也能接受圖片資料， <h> 將二維的像素陣列傳入計算著色器使用 </h> 。透過 `SetTexture()` 函式傳遞圖片至著色器中，一樣需要指定計算核心。

```cs
compute.SetTexture(kernel, "image", image);
```

與所有類型的資料傳遞相同，圖片接收也需要建立對應的變數接收，並且還需要指定圖片的 <h> 通道數量與精度 </h> ，如 `float, fixed3, half4` 等等。

```hlsl
Texture2D<fixed4> image;
```

除此之外，在計算著色器中訪問圖片像素資訊時也與渲染著色器的方法不同，`Texture2D<T>` 是透過像素座標 <h> 直接訪問特定欄位上的資料 </h> ，而非 `sampler2D` 的 uv 採樣函式 `Tex2D()`。

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    fixed4 pixel = image[id.xy];
}
```

`Texture2D<T>` 為只讀的像素緩衝區，如果要允許寫入像素的話需要用 `RWTexture2D<T>`。要注意的是讀寫貼圖只能傳入 `RenderTexture`，原理和建立緩衝區時一樣，建立渲染貼圖時也會做分配空間的工作。

### 釋放空間

由於 GPU 儲存空間是相當珍貴的，所以在不需要緩衝區時也要記得將空間釋放。只要透過 `Release()` 函式執行即可。

```cs
buffer.Release();
renderTexture.Release();
```

## 實作範例

最後，回到最一開始的問題，有什麼問題是能透過並行解決的，以及該怎麼透過並行解決問題？在概括與腳本結構的章節中有看到，無論是計算核心的編寫方法，還是代換成 C# 中迴圈的形式，他們都表現出了一個共同點： <h> 重複執行相似的工作 </h> 。

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction(i);
}
SomeFunction(int index) { }
```

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

意思是， <h> 只要問題能夠被拆分為「個別獨立」並且「高度相似」的片段，就能透過重複執行的方法完成 </h> 。如此一來，無論是要透過迴圈線性執行，或是將每個片段分配給獨立的執行緒，以並行的方式解決，都能有效的達成目標。

最後的章節就透過各種範例，將文中提到的各項重點串起。問題拆分、資料傳遞、解決問題，逐步分析如何使用計算著色器，透過並行的方式達成任務。

{{< resources/assets "examples" "> 如果想直接觀看完整範例腳本也可以點我 <" >}}

### 回顧腳本

首先，在開始解決自己的問題前，先來回顧一次預設的腳本結構，分析它做了哪些事，傳遞了什麼資料，以及該怎麼使用這個計算著色器。

預設著色器宣告了一個計算核心，名稱叫做 CSMain (Compute Shader Main)。

```hlsl
// Each #kernel tells which function to compile; you can have many kernels
#pragma kernel CSMain
```

他只宣告了一個讀寫貼讀緩衝區，精度為 float，通道數量 4 個。代表這個計算著色器要處理的主要資料結構是圖片。

```hlsl
// Create a RenderTexture with enableRandomWrite flag and set it
// with cs.SetTexture
RWTexture2D<float4> Result;
```

由於訪問資料的維度軸為二維（圖片、ㄋ像素陣列），因此執行緒數量的格式為 `(x, y, 1)`。

```hlsl
[numthreads(8,8,1)]
```

最後是預設的計算核心，名稱對應一開始宣告的 `CSMain`。透過多個執行緒對應到圖片緩衝區 `Result` 的每個像素上，同時利用像素座標的數值（也就是 `id`）進行計算，並將計算結果寫入像圖片緩衝區。（先忽略計算式的原理，那不是這裡的重點）

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

回到 C# 處，來看看如何使用這個預設著色器。首先要尋找著色器中定義的計算核心 `CSMain`。

```cs
int kernel = compute.FindKernel("CSMain");
```

接著，為了提供讀寫貼圖需要的圖片資料，需要建立一個 RenderTexture，並傳入計算著色器的 Result 當中。
```cs
resultTex = new RenderTexture(1024, 1024, 0, RenderTextureFormat.Default);
resultTex.enableRandomWrite = true;
resultTex.Create();

compute.SetTexture(kernel, "Result", resultTex);
```

最後，調用著色器執行指定的計算核心。由於著色器中指定的執行序數量為 8，因此執行時必須將執行緒組的數量分配至圖片大小除以 8 才夠。
```cs
compute.Dispatch(kernel, 1 + (resultTex.width / 8), 1 + (resultTex.height / 8), 1);
```

運作結果如下，這是一個能繪製分型的計算著色器。

{{< resources/image "example-0.jpg" "50%" >}}

### 陣列計算

看完了預設的著色器，現在輪到我們應用這些知識嘗試解決自己的問題。一步一步來，首先是：

**1. 要解決什麼問題**

將陣列中每個元素的數值 + n

**2. 要怎麼傳遞資料**

首先是全域只讀的參數，也就是要增加的數值 n。透過 `SetInt()` 函式將數值傳入計算著色器。

```cs
int addition;

compute.SetInt("_Addition", addition);
```

接著是要透過計算著色器處理的資料。建立一個 ComputeBuffer 分配需要 GPU 儲存空間，將要進行操作的陣列資料存入緩衝區，並指定給計算著色器。

```cs
int[] array;

ComputeBuffer buffer = new ComputeBuffer(array.Length, sizeof(int), ComputeBufferType.Structured);
buffer.SetData(array);

compute.SetBuffer(kernel, "valuesBuffer", buffer);
```

**3. 要怎麼解決問題**

將問題拆分為相似的片段，透過重複執行的方式解決問題。在這個例子中便是以多個執行緒分別對應到陣列的所有元素上，並各自執行 + n 的動作。

```hlsl
int _Addition;
RWStructuredBuffer<int> valuesBuffer;

void AddValueKernel (uint3 id : SV_DispatchThreadID)
{
    buffer[id.x] = buffer[id.x] + _Addition;
}
```

由於資料維度為一維陣列，因此執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

最後，呼叫計算著色器執行計算，執行緒組的數量為陣列數量除以 10。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10), 1, 1);
```

**4. 要怎麼使用資料**

運算完畢後，透過 GetData 取得緩衝區資料，用於檢視運行結果。

```cs
int[] result = new int[array.Length];

buffer.GetData(result);
```

{{< resources/image "example-1.jpg" "80%" >}}

### 資料過濾

第二個範例，透過計算著色器進行資料過濾。首先：

**1. 要解決什麼問題**

對陣列的元素進行過濾，找出位於指定範圍中的向量元素。

**2. 要怎麼傳遞資料**

首先是兩個只讀的全域向量，用於作為過濾範圍的最小與最大值。使用 `SetVector()` 函式進行傳遞。

```cs
Vector2 rangeMin, rangeMax;

compute.SetVector("_RangeMin", rangeMin);
compute.SetVector("_RangeMax", rangeMax);
```

接著是要透過計算著色器處理的資料。由於我們像要對元素進行過濾，因此需要建立兩個計算緩衝區，一個為 `StructuredBuffer` 用於 <h> 傳遞原始陣列資料 </h> 進著色器，另一個則是用於 <h> 儲存過濾後元素 </h> 的 `AppendBuffer`。

```cs
Vector2[] array;

ComputeBuffer sourceBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Structured);
ComputeBuffer resultBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Append);
sourceBuffer.SetData(array);

compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "resultBuffer", resultBuffer);
```

除此之外，使用計算著色器過濾元素時，可能因為執行序數量過多而 <h> 導致錯誤的元素被添加至結果緩衝區當中 </h> ，也就是資料傳遞章節中提到的非預期錯誤。為了防止錯誤發生，還需要將實際的陣列長度傳遞給著色器。

```cs
compute.SetInt("_ElementCount", array.Length);
```

**3. 要怎麼解決問題**

將問題拆分為相似的片段，在這個範例中便是透過執行緒 ID 讀取各自欄位上的資料，並將符合條件的元素加入結果緩衝區中。透過 `Append` 函式即可將元素存入緩衝區。

```hlsl
float2 _RangeMin, _RangeMax;

RWStructuredBuffer<float2> sourceBuffer;
AppendStructuredBuffer<float2> resultBuffer;

void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    float2 element = sourceBuffer[id.x];

    if(element.x < _RangeMin.x) return;
    if(element.y < _RangeMin.y) return;
    if(element.x > _RangeMax.x) return;
    if(element.y > _RangeMax.y) return;

    resultBuffer.Append(element);
}
```

為了避免將非預期的元素也存入緩衝區，可以 <h> 判斷執行緒 ID 是否超出陣列的長度 </h> ，作為防呆判斷。

```hlsl
int _ElementCount;

void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    if(id.x >= _ElementCount) return;

    // codes ...
}

```

執行緒的數量和上個範例相同，因為資料維度為一維陣列，所以執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

最後，呼叫著色器執行計算。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10), 1, 1);
```

**4. 要怎麼使用資料**

運算完成後，透過 `GetData()` 取得緩衝區資料，用於檢視效果。

```cs
Vector2[] result = new Vector2[array.Length];

resultBuffer.GetData(result);
```

{{< resources/image "example-2.jpg" "80%" >}}

要注意的是緩衝區在建立時，欄位數量是根據「可能的最大值」建立的，即使 AppendBuffer 當中沒有「添加」那麼多元素，他的 <h> 長度還是會與完整陣列相同 </h> 。如果想獲得實際存入的元素數量，可以透過 [ComputeBuffer.CopyCount](https://docs.unity3d.com/ScriptReference/ComputeBuffer.CopyCount.html) 函式取得。

### 除錯建議

由於著色器本身的除錯難度，再加上兩個環境之間的資料傳遞問題，計算著色器的除錯過程也是相當令人頭疼的。範例的最後就提供幾項除錯時的指標供各位參考，一步步縮小可能的問題範圍。

+ **檢查資料有沒有正確寫入緩衝區**  
    在 `buffer.SetData()` 的環節中是否錯誤？資料有成功傳入緩衝區嗎？資料有沒有傳遞進正確的緩衝區？ <h> 原始資料本身是正確的嗎？ </h>

+ **檢查緩衝區有沒有分配給著色器**  
    在 `compute.SetBuffer()` 的環節是否正常？是否有將緩衝區指定給計算著色器？指定時的計算核心正不正確？ <h> 緩衝區的名稱是否匹配？  </h> 

+ **檢查著色器讀取資料有沒有正確**  
    計算函式訪問緩衝區資料時是否出錯？有沒有訪問到正確的緩衝區？資料欄位的 ID 是否正確？ 

+ **檢查著色器寫入資料有沒有正確**  
    計算函式輸出結果的過程是否正常？ <h> 有沒有將結果寫入緩衝區？ </h> 有沒有寫入到正確的緩衝區中？

+ **檢查著色器計算函式有沒有正確**  
    最後，當上述檢查都確認過以後，問題可能就出在著色器的計算函式本身了。由於各種需求的實際差異甚大，這裡就比較難提供建議了，但請放心，與資料傳遞相比這是最好除錯的部份了～

### 更多例子

上面用了兩個簡單的例子展示如何編寫自己的計算著色器，但要注意這並不是真正「應用」計算著色器時會使用的做法。由於 CPU 與 GPU 間的資料傳遞成本高昂以及運行時機等問題，通常不會像範例中透過 `GetData()` 將資料取回 C#，而是 <h> 直接讓渲染管線使用這些資料 </h> 。

例如傳入 [Graphics.DrawMeshInstancedIndirect](https://docs.unity3d.com/ScriptReference/Graphics.DrawMeshInstancedIndirect.html) 讓 Unity 進行 GPU Instance，或是透過計算著色器將結果繪製到 RenderTexture 中，再利用 ImageEffectShader 渲染到畫面上。

或者將它視為一種「開發工具」也是可以的，使用計算著色器製作出輔助工具，在編輯器狀態下 <h> 事先將高成本的運算完成 </h> ，例如生成光照貼圖與噪聲圖之類的。可惜的是更實際的範例放進來會讓篇幅過長，所以這裡就提供一些實際應用的例子，讓有興趣的人自行深入研究吧～

**Conway's Game of Life**  
康威生命遊戲，以網格為空間單位，每個單位格都是一個細胞，而回合則為這個世界的時間單位，在每個回合中細胞都會 <h> 根據周圍的環境狀態來決定自己將存活還是死亡 </h> 。屬於比較好分辨出如何並行的例子，實做難度低。

{{< resources/image "conway-game-of-life.gif" "80%" "引用自 Conway’s Game of Life Wiki" >}}

具體遊戲規則可以參考 [Wiki](https://zh.wikipedia.org/zh-tw/%E5%BA%B7%E5%A8%81%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F)。

**GPU Slime Simulations**  
透過計算著色器模擬大量的單位，並讓這些單位 <h> 以簡單的行為互相交互 </h> ，產生有趣的結果。屬於比較好玩的例子。實做上稍微複雜一點，需要透過多個階段的處裡才能達成最終效果。

{{< resources/image "slime-simulations.gif" "80%" "引用自 Coding Adventure: Ant and Slime Simulations" >}}

參考影片 [Coding Adventure: Ant and Slime Simulations](https://youtu.be/X-iSQQgOd1A)

**GPU Culling**  
與 GPU Instance 搭配使用的技術，透過計算著色器進行視錐剃除， <h> 過濾出位在攝影機視角內的物件 </h> ，達成更高效的渲染優化。需要注意的主要是渲染相關的問題，是比較實際而且簡單的例子，建議初學著進行嘗試。

{{< resources/image "compute-culling.gif" "80%" "圖片引用自 Unity中使用ComputeShader做视锥剔除" >}}

更多細節可以參考此篇文章 [Unity中使用ComputeShader做视锥剔除（View Frustum Culling）](https://zhuanlan.zhihu.com/p/376801370)。

**GPU Ray Tracing**  
將環境、物件與材質等資料傳入計算著色器， <h> 直接透過自訂的方法進行渲染 </h> ，並將結果輸出至畫面上。方法不侷限於光線追蹤，任何以螢幕像素為單位的並行都可以使用（如射線邁進），是比較實際但較高難度的運用。

{{< resources/image "ray-tracing.jpg" "50%" "引用自 GPU Ray Tracing in Unity" >}}

參考資料 [GPU Ray Tracing in Unity](http://blog.three-eyed-games.com/2018/05/03/gpu-ray-tracing-in-unity-part-1/), [Coding Adventure: Ray Marching](https://youtu.be/Cp5WWtMoeKg)

## 感謝閱讀

在知道了 GPU Instance 和 GPU Culling 兩項技術後，我也接觸到計算著色器這項工具，並正式踏入 GPU 並行的世界了。為了學計算著色器我查了不少資料研究，但總覺的很多內容都不夠直觀，不然就是一口氣跳到太深的內容（像是直接教 RayTracing 的文章），以至於我花了不少時間試錯後才得出一些基礎但相當重要的結論。

於是，在幾個月的實做研究後，我嘗試用自己的理解重新解釋了一次計算著色器，將學習時注意到的各項重點分享給各位，希望能提供有興趣的人參考方向！

有任何建議和想法都歡迎提出討論，如果喜歡文章內容的話也請幫我點一下 Like Button :D

{{< outpost/likecoin >}}

個人網站留言功能尚未製作，如果需要留言還請移駕至[巴哈文章的留言板](https://home.gamer.com.tw/creationDetail.php?sn=5476357) Orz

### 參考資料

[Unity中ComputeShader的基础介绍与使用](https://zhuanlan.zhihu.com/p/368307575)

[Unity | 浅谈 Compute Shader](https://zhuanlan.zhihu.com/p/113482286)

[Ronja's tutorials, Compute Shader](https://www.ronja-tutorials.com/post/050-compute-shader/)

[Getting Started with Compute Shaders in Unity](https://www.youtube.com/watch?v=BrZ4pWwkpto)

[Coding Adventure: Compute Shaders](https://youtu.be/9RHGLZLUuwc)

[numthreads](https://docs.microsoft.com/zh-tw/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

[ComputeBufferType](https://docs.unity3d.com/ScriptReference/ComputeBufferType.html)

[Check if a ComputeShader.Dispatch() command is completed on GPU before doing second kernel dispatch](https://forum.unity.com/threads/check-if-a-computeshader-dispatch-command-is-completed-on-gpu-before-doing-second-kernel-dispatch.369631/)

[hlsl CG compute shader Race Condition](https://stackoverflow.com/questions/59349081/hlsl-cg-compute-shader-race-condition)

[Parallel Computer Architecture and Programming, Spring 2018: Schedule](https://www.cs.cmu.edu/afs/cs/academic/class/15418-s18/www/schedule.html) (感謝巴友 美遊ちゃん 提供)

