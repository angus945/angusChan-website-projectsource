---
title: "筆記 條件判斷與變體著色器"
date: 
lastmod: 

draft: true

description: 條件判斷和 shader fecture 的筆記
tags: [unity, shader]

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


<!-- https://docs.unity3d.com/Manual/shader-conditionals.html -->

學習過程遇到需要開關著色器效果的情況，所以深入研究了一下著色器中的條件判斷以及　Unity Shader 開關效果的方法
這篇是著色器中的條件判斷，以及使用 Unity Shader Variants 進行效果切換的筆記

<!--more-->

## 條件判斷 -

因為硬體架構的差異，與 CPU 不同
GPU 能夠以高效率並行執行簡單的命令（數學計算），不擅長進行條件判斷這種複雜行為

是情況還是會需要用到判斷式 
著色器的條件判斷一共有三種類型 靜態分支、動態分支、數學判斷

### 靜態分支 -

<!-- https://docs.unity3d.com/Manual/shader-branching.html#static-branching -->

在著色器編譯時進行的條件判斷 
就是靜態分支
編譯器會直接將不符條件的分支排除

使用有 # 自前綴的條件式，如 #if, #else, #ifdef
一般的條件式，但使用編譯後固定的靜態變數作為條件，編譯器編譯時就會自動轉換成靜態分之 （範例？
```hlsl
#if 

#else

#endif
```
<!-- https://docs.unity3d.com/Manual/SL-BuiltinMacros.html -->

靜態分支通常是最好的選擇，不會有任何實時運行上的負面影響（編譯時完成），而且會讓程序檔案變小（編譯時排除未用分之）
缺點就是它也只能在編譯時做判斷，所以真的需要實時判斷的時候派不上用場

通常用在 為特定硬體或環境編譯的版本

### 動態分支 -

在運行時執行的條件判斷 就是動態分支 Dynamic branching

<!-- https://docs.unity3d.com/Manual/shader-branching.html#dynamic-branching -->

編寫和一般的 if statement 判斷式編寫方式相同

```hlsl
if()
{

}
else
{

}
```

動態分支的 好處是允許你使用動態的變數做判斷 讓使用者能做到的事情多很多
缺點是額外的計算成本 GPU 不擅長記進行
在不同的硬體上進行可能會有顯著的差異

GPU 必須為最壞的情況預留 暫存器（Register）空間？
假如分支的計算成本差距過大
在執行比較低成本運算時 還是會浪費那些預留的空間

<!-- For any type of dynamic branching, the GPU must allocate register space for the worst case. If one branch is much more costly than the other, this means that the GPU wastes register space. This can lead to fewer invocations of the shader program in parallel, which reduces performance. -->

此外 視判斷條件的內容 動態分之也有兩種類別

**uniform variable**

最好的情況是使用 uniform 變數作為判斷條件，並且條件讓的所有分支成本相近
因為 unifrom 是全域只讀的，所以基本上像同條件的分支都只會有一種結果
而分支成本相近的話 也不會浪費太多暫存器空間

這樣雖然是動態分支但整體的計算環境還是相較穩定的 是比較好的動態分支

```hlsl
uniform bool enableEffect;

if(enableEffect)
{

}
else
{

}
```

**non-uniform variable**
使用動態變數作為判斷條件的情況，可能每個著色器 甚至每個像素走得分支都不同 
著色器表現就會比較差

真的不得已的時候還是得用就是了


動態分支 部份要深掘的話　可能要獨立幾篇筆記才夠了
硬體架構　並行什麼的
因為不是這篇的重點　所以點到為止

Branching based on non-uniform variables means that the GPU must either perform different operations at the same time (and therefore break parallelism), or “flatten the branch” and maintain parallelism by performing the operations for both branches and then discarding one result. Branching based on uniform variables means that the GPU must flatten the branch. Both of these approaches result in reduced GPU performance.

使用情況就是 一般需要條件判斷的情況...


### 數學判斷 -
用數學解決問題 就沒有分支問題了
透過函式切換或乘法開關效果

透過 step() 來開關效果
step(edge, value) 函式會在 value > edge 時回傳 1，反之 0

```hlsl
float result = effect * step(edge, value);
```

利用 step 加上 lerp 來達成 if, else 的效果

```hlsl
float result = lerp(resultA, resultB, step(edge, value));
```

優點是 有時候判斷條件就是動態的變數 直接寫成一行計算式也蠻簡潔的
缺點是沒用到的部份進行計算，而且判斷條件限制也比較多

比較常用在特效類的計算上，尤其是具有距離場性質的計算，例如經典的溶解特效就是一個例子 


不要把硬去把判斷式轉換成數學判斷
大多情況下這只會是負優化 該用判斷式的時候就用ㄅ 要優化的話編譯器會幫你完成的
阿要是編譯器如果做不到　一般使用者也不太可能做的更好了　反正情況也不會再更差了 (X 


## 變體著色器 -

Shader variant

Unity 引擎提供的 方法
定義著色器變體
透過靜態分支將著色器編譯出多個版本 透過切換變體來避免運行時的動態分支 同時又能達到接近動態分支的效果

### 宣告變體

變體有兩種宣告方式 multi_compile 與 shader_feature 
比較大的差異是建置時 shader_feature 會自動忽略沒有（材質球）使用到的變體？ TODO 實驗

筆記中會統一使用  shader_feature
透過 #pragma shader_feature 進行宣告
後面透過空白分隔複數個變體
假設你有三種效果想要切換

```hlsl
#pragma shader_feature effect_A effect_B effect_C
```

同一個群組只能啟用一種變體類別
如果想要同時使用就得獨立宣告
除了三種效果以外 還想要兩種亮度分別

```hlsl
#pragma shader_feature effect_A effect_B effect_C
#pragma shader_feature light_dark light_bright
```

effect_A + light_dark 就是允許的 light_dark + light_bright 不允許
根據需求建立不同的變體

除此之外
如果是單一效果要開關的話，shader_feature 只要建立一種變體即可，如
#pragma shader_feature effect_A

但使用就會需要空白變體 (Blank) 表示這是會被關閉的，透果底限定義
#pragma multi_compile __ effect_A

<!-- multi_complie vs shader_feature https://zhuanlan.zhihu.com/p/77043332 -->
<!-- https://docs.unity3d.com/2018.4/Documentation/Manual/SL-MultipleProgramVariants.html -->

<!-- So shader_feature makes most sense for keywords that will be set on the materials, while multi_compile for keywords that will be set from code globally. -->

### 使用變體

定義完成後

著色器的何處要屬於變體範圍

透過靜態分支的條件判斷 判斷當前屬於哪種變體

```
void function()
{
    #ifdef effect_A
        // do some thing...
    #endif
}
```

同一個 群組？ 的變體 像是 switch cast

```
void function()
{
    #ifdef effect_A
        // do some thing...
    #elif effect_B
        // do some thing...
    #elif effect_C
        // do some thing...
    #endif
}
```


### 變體數量

變體的數量會指數增長

```
#pragma shader_feature color_Red color_Green color_Blue
```

一共會產生三種變體

```
#pragma shader_feature color_Red color_Green color_Blue
#pragma shader_feature quality_low quality_height
```

一共會產生 3 x 2 種變體

除此之外還會有引擎自動產生的幾中變體

全局變體的數量上限

添加 _local 的後綴不會算進全局中


### 切換變體

本地全局
material.EnableKeyword()

<!-- https://docs.unity3d.com/Manual/shader-keywords.html#stage-specific-keywords -->
<!-- https://zhuanlan.zhihu.com/p/77043332 -->

全局變體
Shader.EnableKeyword
CommandBuffer.EnableShaderKeyword

### 優點缺點

**優點**
不用擔心動態分支

**缺點**
編譯時會生出一大堆變體文件
會提高實時的 GPU 記憶體用量

Unity 的 Standard shader 就是有一堆變體的
https://github.com/TwoTailsGames/Unity-Built-in-Shaders/blob/master/DefaultResourcesExtra/Standard.shader

mega shaders

### 建置設定

預設 Bild 不會把變體打包，需要經過設定
ShaderVariantCollection 
Project Setting > Graphics > Shader Loading > Preloaded Shader

## 總結

最後我是透過 cginclude 和 shader_feature 做效果開關

每次的情況都不同 沒有最佳解



### 參考資料

變體著色器
https://docs.unity3d.com/Manual/shader-variant-collections.html


https://docs.unity3d.com/Manual/shader-keywords.html


https://docs.unity3d.com/Manual/SL-MultipleProgramVariants.html

https://zhuanlan.zhihu.com/p/190233160


https://chrislin1015.medium.com/unity%E6%89%8B%E6%9C%AD-multi-compile%E8%88%87shader-feature%E7%9A%84%E5%B7%AE%E7%95%B0-feat-materialpropertydrawer-241b61da2db8









