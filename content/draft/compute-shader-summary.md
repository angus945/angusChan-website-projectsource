---
title: "【筆記】入門重點，計算著色器"
date: 2022-05-14
lastmod: 2022-05-14

draft: false

description:
tags: [Unity, ComputeShader]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/shader/compute-shader/

## customize page background
background: "none"

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!-- TODO Colors -->

## 概括 +-

計算著色器 (Compute Shader) 是一種位於於渲染管線之外，用途也不僅限於著色計算的獨立工具，意圖利用 GPU 的大量計算核心的優勢，透過高效的平行運算方式解決問題。這篇文章是我在研究這項技術一段時間後，總結出的各項初學重點，在這裡分享給各位。

<!--more-->

這篇文章中一共用到兩種程式語言，由 CPU 運作的 C# (CSharp)，以及由 GPU 運作的 HLSL (High Level Shader Language)，由於兩者的編寫差異，閱讀程式碼時請注意標題。範例使用的環境為 Unity 引擎，雖然文章的主要內容基本上是通用的，但實做時還請注意環境差異。

那麼，正式開始前請先讓我解釋一下計算著色器的兩大重點：

### 並行運算 +-

首先，假設現在我們想重複執行某項任務 10 次，在常規的 CPU 語言中會透過迴圈執行，根據給定的條件（如計數器）重複執行任務，以現在的例子便是根據執行次數 `i`，由開始 0 直到行完第 9 次後結束。並且由於 CPU 語言是線性執行的，因此只有在當前的迴圈內容被完整執行完畢後，才會進入下一次的迴圈。

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

但是在著色器這種 GPU 語言中，函式則會交由十個獨立的執行緒 (thread) 進行運算，讓 GPU 的大量核心以平行的方式完成任務，執行時並無順序之分（亂序）。

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

這裡用一張簡單的示意圖展示運作差異。注意，這只是表示兩者「運作方式的差異」，與實際運行時的處理效率無關。

<!-- TODO 示意圖 -->

不過，在計算著色器中，運作差異並不是真正的難點，如果有編寫材質著色器經驗的話，應該已經很熟悉平行運算這件事了。與材質著色器不同的點在於，計算著色器是獨立於渲染管線之外的系統，所以它也沒有 vertices shader 或 fragment shader 這種渲染管線提供的「框架」來提示使用者該做些什麼。

所以編寫計算著色器的真正的難點是，在少了明確的目標指引以後，我們只能靠自己判斷 <h> 有什麼問題是能透過並行解決的 </h> ，以及 <h> 該怎麼透過並行解決問題 </h> 。初次接觸並行運算容易遇到的瓶頸，便是因為不熟悉這種截然不同的問題拆分方法而導致的。

### 資料傳遞 +-

計算著色器的第二項難點：資料傳遞。

在常規的渲染著色器中，引擎管線會幫使用者處理完資料傳遞等問題。但在計算著色器中，使用者擁有更大的權力能指揮 GPU 幫助我們達成各種任務，因此相應的責任也產生了，我們必須接手一些原本會由渲染管線完成的工作 - 資料傳遞。

CPU 與 GPU 運作時使用的儲存空間不同，因此想執行任何的操作前都必須先將資料傳遞給 GPU 才行。由於資料是在兩種不同環境中進行傳遞，資料從哪裡來、資料到哪裡去，該傳遞什麼資料以及該怎麼傳遞資料都是實做時需要面對的問題。

<!-- 示意圖 -->

再加上著色器本身的除錯難度，使用者難以辨識究竟是資料傳遞出錯還是著色器計算有誤。對於初次接觸計算著色器，還不熟悉除錯方法的新手來說也是一大瓶頸。

## 腳本結構 +-

以下是 Unity 中的預設 Compute Shader 腳本，這個章節就來逐步解析他的結構。

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

### 計算核心 +-

就和名稱一樣，計算核心 (Kernel) 是計算著色器中的核心區塊，當執行計算著色器時，其中的程式便會透過並行的方式運行。

透過 `#pragma kernel ___` 關鍵字宣告計算核心，就和 vert 和 frag 編寫時一樣，核心的名稱可以自由定義，但一定要有一個對應的函式實做才能運行。一個計算著色器也可以根據需求定義複數個核心。

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

### 多執行緒 +-

定義和實做了計算核心之後，接著便需要指定需要的「執行數量」。並行是透過將工作分配給多個執行緒達成的，因此除了定義計算核心外，還需要透過 `[numthreads(x, y, z)]` 分配這個核心需要的執行緒數量 "num" "threads"。

```hlsl
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```

三個欄位分別代表維度軸 `xyz`，計算著色器運作時便會透過 `SV_DispatchThreadID` 將當前的執行緒 ID 傳入計算函式中。轉換成 CPU 語言中的迴圈看起來應該會更直觀。

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

<!-- TODO 示意圖 -->

至於為什麼會執行緒的數量需要三個維度軸呢？Microsoft 官方文檔是這樣說的：[numthreads](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

> For example, if a compute shader is doing 4x4 matrix addition then numthreads could be set to numthreads(4,4,1) and the indexing in the individual threads would automatically match the matrix entries. The compute shader could also declare a thread group with the same number of threads (16) using numthreads(16,1,1), however it would then have to calculate the current matrix entry based on the current thread number.

簡單來說就是為了「方便」，視你要處理的資料結構而定，多的維度軸可以幫使用者省去轉換工作，讓 ID 與資料欄位直接對應。與 CPU 語言中，要遍歷具有座標性質的資料時（如二維陣列），透過兩層迴圈對應維度的 x, y 軸會更加輕鬆同理。

當然並行時也同理，假如我現在要處理的是圖片資料，透過兩個維度軸直接對應至像素位置上，會比透過長寬換算來的方便，這就是為什麼計算著色器也允許分配多個軸向的執行緒數量。

### 執行緒組 +-

由於計算著色器的運行時機是由使用者掌控的，因此在定義完計算核心與執行序數量後，還是需要手動呼叫 `ComputeShader.Dispatch`來「運行」計算著色器。

<!-- TODO 真正的運行時機？ -->

```cs
public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 
```

`Dispath` 函式一共接受四個參數輸入，第一個 `kernelIndex` 代表的是這次 Dispath 要使用的計算核心，如果著色器中有定義複數的核心，便可由這裡進行選擇。可以使用 `FindKernel` 函式，透過名稱尋找對應的計算核心。

```cs
int knrnelIndex = compute.FindKernel("MyComputeKernel");

compute.Dispatch(knrnelIndex, 1, 1, 1);
```

至於後面三個參數 `threadGroupsX,Y,Z`，代表的是這次運行著色器要分配的「執行緒組」有多少個 "thread" "Groups"（下面簡稱 "組"）。上個部份提到的 `numthread` 分配的是一個組裡面要有多少執行緒，而 `threadGroups` 則會指定一共使用多少組來運行。

因此，當計算著色器運行時，最終會執行的次數（也是分配的執行緒數量）會有 threadGroups * numthreads 次。同樣，替換 CPU 語言中的迴圈看起來會更直觀。

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

但也再次提醒，這只是比喻，別忘了一開始的對比圖。而且組和組之間也會並行，並非上一個組完成才會進入下一個組。

<!-- TODO 示意 -->

每個執行緒的 SV_DispatchThreadID 便是當前的組 * 執行緒數量 + 當前的執行緒，不過這些 ID 的計算著色器運行時都會幫我們完成，所以使用者只要分配好需要的數量即可。

<!-- TODO https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/images/threadgroupids.png -->

至具體數量該怎麼分配呢？首先從處理資料的維度下手，假設著色器要處理的主要數據為一維的陣列就分配 `(n, 1, 1)`，若要對圖片的二維像素陣列操作就用 `(x, y, 1)`，或是要計算三維的體積網格就 `(x, y, z)`。

執行緒的具體數量或比例則沒有明確規則，大概抓個介於 10 和資料總數 1% 以下的數值吧。假設陣列長度大約一萬，numthread 就分配為 `(100, 1, 1)`，若圖片大小 2048 的話就分配 `(20, 20, 1)`。

最後，組的數量可以透過資料長度除以執行緒數量得出，畢竟資料的多寡可能根據情況產生差異，透過這種方式可以確保任何情況下都有足夠的組來運行著色器。

```cs
compute.Dispatch(knrnelIndex, 1 + (array.Length / 100), 1, 1);
compute.Dispatch(knrnelIndex, 1 + (image.width / 20), 1 + (image.height / 20), 1);
```

在著色器訪問陣列時，不會因為 index out of range 出現錯誤而中斷，所以只需要確保分配的數量足夠即可。（只有少數情況會因為數量過多導致結果錯誤，文章最後的範例會提到解決方法）

### 資料訪問 +-

最後，計算著色器中最關鍵的部份，對傳入著色器的資料進行操作，透過並行運算達成任務！如果執行緒的數量分配正確，每個 ThreadID 都會對應到各自的要處理的資料欄位上。

假如我要將一張圖片重置為黑色，只需要透過執行緒 ID 對應至圖片的每個像素，並將黑色寫入像素即可。由於資料的維度為二維，因此訪問資料欄位時的索引也是二維輸入。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void ClearImage (uint3 id : SV_DispatchThreadID)
{
    Image[id.xy] = float4(0, 0, 0, 1);
}
```

並且，每個執行緒的資料訪問也不侷限於自己的 ID，視需求也可以讀、寫其他欄位上的資料。例如時常應用在影像處理中的卷積矩陣 (Kernel Convolution)，就會參考周圍像素的資料來進行計算。下面是方框模糊的範例程式，將像素與周圍八格進行平均。

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

<!-- TODO 示意圖 -->

## 資料傳遞 +-

資料傳遞，計算著色器的第二項重點。一開始有提到過，CPU 與 GPU 運作時使用的儲存空間不同，因此想執行任何的操作前都必須先將資料傳遞給 GPU 才行，這個章節就來解說如何將資料傳遞給計算著色器使用。

### 只讀參數 +-

就和一般的渲染著色器一樣，計算著色器也可以傳入獨立的參數用於計算。且同樣的，這些數值在著色器中是全局共享的，報括不同計算核心、函式，並且只讀，通常用於傳遞屬性類的參數。

以繪圖系統為例就是畫布大小、筆刷位置、筆刷強度與顏色等等。透過 `SetVector`, `SetFloat` 等函式進行傳遞。

```cs
compute.SetVector("_CanavsSize", canvasSize);
compute.SetVector("_BrushPos", mousePosition);
compute.SetFloat("_Intensity", intensity);
compute.SetVector("_Color", color);
```

要使用這些參數的話，在著色器中也需要建立對應的變數接收。

```hlsl
int2 _CanavsSize;
float2 _BrushPos;
float _Intensity;
float4 _Intensity;
```

### 緩衝資料 +-

與只讀的全域參數不同，由於資料儲存空間的差異以及資料傳遞的成本，若想讓計算著色器對資料內容進行讀寫，或是想傳遞大量的獨立參數供不同執行緒個別使用的話，就必須先對 GPU 的儲存空間進行分配。

GPU 的資料儲存空間為緩衝區 (Buffer)，在 Unity 中只需要透過 `new ComputeBuffer()` 即可建立一個新的 GPU 緩衝區，引擎會完成其他的內部作業。

```cs
ComputeBuffer buffer = new ComputeBuffer(count, stride, ComputeBufferType);
```

計算緩衝區的建構子需要接收三個參數輸入，第一個 `count` 代表的是緩衝區「最多」需要儲存多少元素，通常就是我們想傳遞的陣列資料的長度。`stride` 為一個欄位的元素大小，通常就是想傳遞的陣列資料的型別，可以透過 `sizeof(type)` 取得。

而最後的 `ComputeBufferType` 則是緩衝區的類別，可以根據需求使用不同的類型。具體的類型有許多種，不過這裡就先關注最常用的兩種就好：

+ **ComputeBufferType.Structured**  
    結構緩衝區，通常用於傳遞一般的陣列資料，讓計算著色器讀、寫其中的資料。

+ **ComputeBufferType.Append**  
    容器緩衝區，允許計算著色器對它「添加」元素，通常用於資料過濾。

假設我要將一個長度為 10000 的向量陣列傳入計算著色器，並對裡面的元素進行過濾的話，就會需要兩個緩衝區。緩衝區長度為 10000、元素大小為三個單精度浮點數，緩衝區類型為 Structured 與 Append。

```cs
Vector3[] positions = new Vector3[10000];

sourceBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Structured);
filteBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Append);
```

在分配完儲存空間後，還需要將欲傳遞的資料透過 `SetData` 存入緩衝區。

```cs
sourceBuffer.SetData(positions);
```

最後，只需要將緩衝區指定給計算著色器，就能讓他在運行時使用這些資料了，不過與先前的只讀參數不同，緩衝資料需要指定給一個計算核心。不太需要擔心這個動作的開銷，因為在 `SetData` 的時候資料傳遞就已經完成了，這裡只是改變計算著色器中對緩衝區空間的指標而已。

```cs
compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "filteBuffer", filteBuffer);
```

計算著色器也需要對應的緩衝區變數接收才能使用這些資料，建立時需要透過 `<T>` 欄位指定資料型別。

```hlsl
StructuredBuffer<float3> sourceBuffer;
AppendStructuredBuffer<float3> filteBuffer;
```

若想在讓緩衝區一次傳遞複合資料，也可以透過結構包裝多重變數。在 C# 部份也是建立相同的結構進行傳遞。

```hlsl
struct transform
{
    float3 position;
    float3 rotation;
    float3 scale;
};

StructuredBuffer<transform> transforms;
```

除此之外，結構緩衝區還有一種 `RWStructuredBuffer<T>`，這種緩衝區會允許計算核心將資料寫入緩衝區，視需求使用。

### 貼圖資料 +-

除了傳遞一維陣列進緩衝區外，計算著色器也能接受圖片資料，將二維的像素陣列傳入計算著色器使用。透過 `SetTexture()` 函式傳遞圖片至著色器中，和緩衝資料一樣需要指定計算核心。

```cs
compute.SetTexture(kernel, "image", image);
```

與所有資料傳遞相同，圖片接收也需要建立對應的變數。建立時需要 `<T>` 欄位指定圖片的通道數量與精度，`float, fixed3, half4` 等等。

```hlsl
Texture2D<fixed4> image;
```

不過在訪問圖片像素時，與一般著色器的 `sampler2D` 不同，`Texture2D<T>` 是透過像素座標直接訪問特定欄位上的資料，而非 `Tex2D` 的 uv 採樣。

<!-- TODO 浮點數 id 的 filter  -->

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    fixed4 pixel = image[id.xy];
}
```

`Texture2D<T>` 為只讀的像素緩衝區，如果要允許寫入像素的話需要用 `RWTexture2D<T>`。要注意的是讀寫貼圖只能傳入 `RenderTexture`，原理和建立緩衝區時一樣，建立渲染貼圖時也會做分配空間的工作，才能讓著色器寫入數值。

### 釋放空間 +-

最後，由於 GPU 儲存空間是相當珍貴的，所以在不需要緩衝區時也要記得將空間釋放。透過 `Release` 函式執行。

```cs
buffer.Release();
renderTexture.Release();
```

<!-- TODO Dispose vs Release -->

## 實作範例 +

最後，回到最一開始的問題，有什麼問題是能透過並行解決的，以及該怎麼透過並行解決問題？無論是計算核心的編寫方法，還是代換成 C# 中迴圈的形式，他們都表現出了一個共同點：重複執行相似的工作。

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction(i);
}
SomeFunction(int index) { }
```

意思是，如果要解決的問題能夠被拆分為個別獨立並且高度相似的片段，就能透過重複執行的方法完成。只要能完成拆分工作，那麼無論要透過迴圈線性執行，或是將每個問題片段分配給獨立的執行緒，以並行的方式解決都能完成任務。

最後的章節就透過各種範例將文中提到的各項重點串起，問題拆分、資料傳遞、解決問題，逐步分析如何使用計算著色器，透過並行的方式達成任務。

{{< resources/assets "examples" "> 如果想直接觀看完整腳本也可以點我 <" >}}

### 回顧腳本 +

首先，回顧一次預設的計算著色器結構，分析一下這個著色器做了哪些事，以及要傳遞什麼資料，和要怎麼使用這個腳本。

宣告了一個計算核心，名稱叫做 CSMain。

```hlsl
#pragma kernel CSMain
```

定義一個讀寫貼圖給計算著色器使用，精度為 float，通道數量 4 個。

```hlsl
RWTexture2D<float4> Result;
```

指定著色器要使用的執行序數量，由於訪問資料的維度軸為二維（圖片、像素資料），因此數量的格式為 `(x, y, 1)`。
```hlsl
[numthreads(8,8,1)]
```

實做計算核心的函式，名稱對應一開始宣告的 CSMain 核心。透過多個執行緒，對應到圖片資料 Result 的每個像素上，並根據像素的座標（也就是 id）寫入計算過後的像素數值。（先忽略計算式的原理，那不是這裡的重點）

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

回到 C# 處，接著來看看如何使用這個預設著色器。首先要尋找著色器中定義的計算核心 CSMain。

```cs
int kernel = compute.FindKernel("CSMain");
```

接著建立 RenderTexture，並傳入計算著色器的 Result 當中，提供著色器使用。
```cs
    resultTex = new RenderTexture(1024, 1024, 0, RenderTextureFormat.Default);
    resultTex.enableRandomWrite = true;
    resultTex.Create();
```

最後，調用著色器執行指定的計算核心。由於著色器中指定的執行序數量為 8，因此執行時必須將組的數量分配至圖片大小 / 8 才會足夠。
```cs
compute.Dispatch(kernel, 1 + (resultTex.width / 8), 1 + (resultTex.height / 8), 1);
```

運作結果如下，這是一個能繪製分型的計算著色器。

{{< resources/image "example-0.jpg" "50%" >}}

### 陣列計算 +

看完了預設的著色器，現在輪到我們解決自己的問題，嘗試透過平行運算對陣列元素進行操作。一步一步來，首先是：

**1. 要解決什麼問題**

透過並行運算將陣列中每個元素的數值 + n

**2. 要怎麼傳遞資料**

首先透過 SetInt 函式將要添加的數值 n 傳入著色器當中。

```cs
int addition;

compute.SetInt("_Addition", addition);
```

接著透過 ComputeBuffer 分配 GPU 緩儲存空間，將要進行操作的陣列資料存入緩衝區，並指定給計算著色器。

```cs
int[] array;

ComputeBuffer buffer = new ComputeBuffer(array.Length, sizeof(int), ComputeBufferType.Structured);
buffer.SetData(array);

compute.SetBuffer(kernel, "valuesBuffer", buffer);
```

**3. 要怎麼解決問題**

將問題拆分為相似的片段，透過重複執行的方式解決問題。在這個例子中便是以多個執行緒分別對應到陣列的所有元素上，並各自執行 + n 的動作。

```hlsl
void AddValueKernel (uint3 id : SV_DispatchThreadID)
{
    buffer[id.x] = buffer[id.x] + _Addition;
}
```

由於資料維度為一維陣列，因此執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

呼叫計算著色器執行計算，組的數量為陣列數量 / 10。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10f), 1, 1);
```

**4. 要怎麼使用資料**

在運算完成後，透過 GetData 取得緩衝區資料，用於檢視效果。

```cs
int[] result = new int[array.Length];

buffer.GetData(result);
```

{{< resources/image "example-1.jpg" "80%" >}}

### 資料過濾 +

第二個範例，透過計算著色器進行資料過濾。首先：

**1. 要解決什麼問題**

透過並行運算對陣列中的元素進行過濾，找出位於指定範圍中的向量元素 

**2. 要怎麼傳遞資料**

首先是作為範圍參考的兩個向量，透過 `SetVector` 傳遞。

```cs
Vector2 rangeMin, rangeMax;
compute.SetVector("_RangeMin", rangeMin);
compute.SetVector("_RangeMax", rangeMax);
```

接著分配 GPU 除存空間，建立兩個緩衝區，一個用於傳遞原始陣列進著色器 `Structured`，另一個則作為除存過濾後元素的容器 `Append`。並指定給計算著色器使用。

```cs
Vector2[] array;

ComputeBuffer sourceBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Structured);
ComputeBuffer resultBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Append);
sourceBuffer.SetData(array);

compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "resultBuffer", resultBuffer);
```

傳遞陣列長度給著色器，用於防止執行緒數量超出陣列長度時產生的非預期結果。

```cs
compute.SetInt("_ElementCount", array.Length);
```

**3. 要怎麼解決問題**

以多個執行緒對應到陣列的所有元素上，判斷元素是否大於範圍最小值，同時小於範圍最大值，並將符合條件的元素加入結果緩衝區中。

```hlsl
void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    float2 position = sourceBuffer[id.x];

    if(position.x < _RangeMin.x) return;
    if(position.y < _RangeMin.y) return;
    if(position.x > _RangeMax.x) return;
    if(position.y > _RangeMax.y) return;

    resultBuffer.Append(position);
}
```

雖然計算著色氣在訪問緩衝區的資料時不會因為超出長度而出錯，但在使用到 AppendBuffer 的情況下，多出的長度可能是使計算著色器將非預期的元素存入緩衝區，因此需要透過防呆判斷避免這件事發生。

```hlsl
void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    if(id.x >= _ElementCount) return;

    // codes ...
}

```

由於資料維度為一維陣列，因此執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

最後，呼叫著色器執行計算。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10), 1, 1);
```

**4. 要怎麼使用資料**

運算完成後，透過 GetData 取得緩衝區資料，用於檢視效果

```cs
Vector2[] result = new Vector2[array.Length];

resultBuffer.GetData(result);
```

{{< resources/image "example-2.jpg" "80%" >}}

### 更多例子 +

上面用了兩個簡單的例子展示如何編寫自己的計算著色器，不過要注意這並不是「真正」應用計算著色器時會使用的作法。由於 CPU 與 GPU 間的資料傳遞成本高昂，實際應用時不會像範例中透過 GetData 將資料取回 C#，而是直接讓渲染管線使用這些資料。

例如傳入 [Graphics.DrawMeshInstancedIndirect](https://docs.unity3d.com/ScriptReference/Graphics.DrawMeshInstancedIndirect.html) 讓 Unity 進行 GPU Instance，或是透過計算著色器將結果繪製到 RenderTexture 中，再利用 ImageEffectShader 渲染到畫面上。可惜的是更實際的範例放進來會讓篇幅太長，所以這裡就先提供一些實際應用的例子，讓有興趣深入的人自行研究。

**Conway's Game of Life**  
康威生命遊戲，每個單位格都是一個細胞，以獨立的回合為時間單位，在每個回合中細胞都會根據周圍的環境狀態來決定自己將會存活還是死亡。屬於比較好分辨出如何並行的例子。

{{< resources/image "conway's-game-of-life.gif" >}}

具體遊戲規則可以參考 [Wiki](https://zh.wikipedia.org/zh-tw/%E5%BA%B7%E5%A8%81%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F)。

**GPU Slime Simulations**  
透過計算著色器模擬大量的單位，並讓這些單位以簡單的行為互相交互，產生有趣的結果。屬於比較好玩的例子。

{{< resources/image "slime-simulations.gif" "80%" >}}

參考影片 [Coding Adventure: Ant and Slime Simulations](https://youtu.be/X-iSQQgOd1A)

**GPU Culling**  
與 GPU Instance 搭配使用的技術，透過計算著色器進行視錐剃除，過濾出在攝影機視角內的物件，達成更高效的渲染優化。是比較實際而且簡單的例子。

{{< resources/image "compute-culling.gif" >}}

更多細節可以參考此篇文章 [Unity中使用ComputeShader做视锥剔除（View Frustum Culling）](https://zhuanlan.zhihu.com/p/376801370)。

**GPU Ray Tracing**  
將環境、物件與材質等資料傳入計算著色器，直接透過自訂的方法進行渲染，並將結果輸出至畫面上。方法不侷限於光線追蹤，任何以螢幕像素為單位的並行都可以使用（如射線邁進），是比較實際但也有難度的運用。

{{< resources/image "ray-tracing.jpg" "50%" >}}

參考資料 [GPU Ray Tracing in Unity](http://blog.three-eyed-games.com/2018/05/03/gpu-ray-tracing-in-unity-part-1/)

## 感謝閱讀 +

在知道了 GPU Instance 和 GPU Culling ，我也接觸到計算著色器這項工具了，正式踏入 GPU 並行的世界。但查了不少資料感覺都不夠直觀，不然就是一口氣跳到太深的內容（像是直接教 RayTracing 的文章）。

於是在花幾個月實做和研究各項些東西後，嘗試用自己的理解重新解釋一次計算著色器，這篇筆記就是我整理出關於計算著色器的幾項重點，在這裡分享給各位，如果有任何建議都歡迎提出。

### 參考資料 +

[numthreads](https://docs.microsoft.com/zh-tw/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

[Unity中ComputeShader的基础介绍与使用](https://zhuanlan.zhihu.com/p/368307575)

[Coding Adventure: Compute Shaders](https://youtu.be/9RHGLZLUuwc)

[Getting Started with Compute Shaders in Unity](https://www.youtube.com/watch?v=BrZ4pWwkpto)

https://zhuanlan.zhihu.com/p/113482286
執行緒不夠的情況

<!-- https://docs.unity3d.com/ScriptReference/ComputeBufferType.html -->
