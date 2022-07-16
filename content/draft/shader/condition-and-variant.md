---
title: "【筆記】條件判斷與變體著色器"
date: 
lastmod: 

draft: true

description: 條件判斷與變體著色器的筆記
tags: [unity, shader]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/shader/condition-and-variant/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---


<!-- https://docs.unity3d.com/Manual/shader-conditionals.html -->

學習過程遇到需要開關著色器效果的情況，所以深入研究了一下著色器中的條件判斷以及　Unity Shader 開關效果的方法
這篇是著色器中的條件判斷，以及使用 Unity Shader Variants 進行效果切換的筆記

<!--more-->

## 條件判斷 +

因為需求而導致的硬體架構差異，讓 CPU 與 GPU 擅長的工作截然不同，雖然 GPU 能夠以並行的方式高效執行大量的數學計算，不過相對不擅長進行條件判斷這種複雜行為。但實際在編寫時還是可能遇到條件的需求，為了達成這點，著色器大致上有三種條件判斷的類型可以使用，靜態分支、動態分支與數學判斷。

### 靜態分支 +

靜態分支 (Static Branch)，在著色器編譯時進行的條件判斷，編譯器會直接將不符條件的分支排除。使用預處理關鍵字 `#` 加上條件式進行編寫，如 `#if, #else, #ifdef`，編譯時就會作為靜態分支判斷。

```hlsl
#if 
    // do some thing...
#else
    // do some thing...
#endif
```

<!-- https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-appendix-pre-if -->

除此之外，如果你編寫一般的條件式，但使用編譯後固定的常量作為條件 (compile-time constant value)，編譯器檢測到時會自動將它作為靜態分支判斷，並直接剔除掉不符條件的分支。

```
static const float version = 0;

fixed4 frag (v2f i) : SV_Target
{
    if(version < 5)
    {
        do some thing...    
    }
}
```

註：可以透過編輯器觀看編譯後的結果

<!-- https://gamedev.stackexchange.com/questions/84166/in-hlsl-what-is-the-difference-between-static-const-and-define-for-constan -->

靜態分支通常是最好的選擇，因為它不會有任何實時運行上的負面影響（編譯時完成），而且會讓程序檔案變小（編譯時排除未用分支）。但相對的缺點也很明顯，就是它也只能在編譯時做判斷，所以能作到的工作比較侷限。通常用在為特定硬體或環境編譯的著色器。

<!-- https://docs.unity3d.com/Manual/shader-branching.html#static-branching -->

```
#if SHADER_TARGET < 30
    // less than Shader model 3.0:
    // very limited Shader capabilities, do some approximation
#else
    // decent capabilities, do a better thing
#endif
```
<!-- https://docs.unity3d.com/Manual/SL-BuiltinMacros.html -->

### 動態分支 +

動態分支 (Dynamic Branch)，在著色器運行時執行的條件判斷，讓渲染時能根據條件內容獲得不同結果。編寫和一般的 if statement 判斷式編寫方式相同。

```hlsl
if()
{

}
else
{

}
```

動態分支的好處是允許你使用動態的變數實時做判斷，讓使用者能做到的事情多很多。著色器在遇到動態分支的時候會有兩種行為。

1. 只計算符合條件的部份，這會導致不同執行序中的運算內容不同，破壞並行性。
2. 扁平化計算，把所有分支上的計算都執行完畢，再拋棄不要的結果，保持並行性但會導致多餘的計算。

<!-- Branching based on non-uniform variables means that the GPU must either perform different operations at the same time (and therefore break parallelism), or “flatten the branch” and maintain parallelism by performing the operations for both branches and then discarding one result. Branching based on uniform variables means that the GPU must flatten the branch. Both of these approaches result in reduced GPU performance. -->


無論何者都會對效能產生負面影響，並且 GPU 運算遇到分支時必須為最壞的情況預留暫存器（Register）空間，假如不同分支的計算成本差距過大，在它在執行比較低成本運算時，就會浪費那些預留的空間，這也是動態分支的主要缺點。

<!-- https://docs.unity3d.com/Manual/shader-branching.html#dynamic-branching -->

此外，視判斷條件的內容動態分之也有兩種類別：

**uniform variable**

最好的情況是使用 uniform 變數作為判斷條件，並且條件的所有分支成本相近。因為 unifrom 是全域只讀的，所以基本上像同條件的分支都只會有一種結果，而分支成本相近的話也不會浪費太多暫存器空間。

如此一來，這樣雖然是動態分支但整體的計算環境還是相較穩定的，是比較理想的使用情況。

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

使用完全的動態變數作為判斷條件，可能每個著色器甚至每個像素走得分支都不同，這種情況下效能表現就會比較差，但要深掘原因的話可能要獨立幾篇筆記才夠，所以點到為止。

使用情況就是需要條件判斷但無法編寫成靜態分支的時候，在計算著色器中就很常使用。

### 數學判斷 +

用數學解決問題就沒有分支問題了，透過函式乘法計算達成條件判斷的效果。最常見的是透過 `step(edge, value)` 函式來開關效果，這個函式會在 value > edge 時回傳 1，反之 0，利用這個特性就能達成開關效果。

```hlsl
float result = effect * step(edge, value);
```

或是將它放在 lerp 的權重輸入裡，也能達成 if else 的效果。

```hlsl
float result = lerp(resultA, resultB, step(edge, value));
```

數學判斷的優點是，有時候條件就是動態的變數，直接寫成一行計算式反而簡潔。但缺點是沒用到的部份也會進行計算，而且判斷式稍微複雜點就會很難維護。

數學判斷基本上與動態分支的扁平化類似，但即使如此也不要把硬去把判斷式轉換成數學判斷，大多情況下這只會是負優化。該用判斷式的時候還是去用，要優化的話編譯器會幫你完成的。

阿要是編譯器如果做不到一般使用者也不太可能做的更好了，反正情況也不會再更差了 (X 

數學判斷比較常用在特效類的計算上，尤其是具有距離場性質的計算，例如經典的溶解特效就是一個例子 

TODO 圖片

## 變體著色器 +

變體著色器 (Shader Variant)，由 Unity 引擎提供的一種特殊方法，透過不同的變體關鍵字區分著色器內容，在編譯時透過靜態分支將著色器編譯出多個版本，透過切換變體來避免運行時的動態分支，同時又能達到接近動態分支的效果。

### 變體關鍵字 +

變體有兩種宣告方式 `multi_compile` 與 `shader_feature`，使用上差異不大，筆記中會統一使用 shader_feature。

透過 #pragma shader_feature KEYWORD 進行宣告，命名規範為全大寫 透過一個底限分隔類別，如果要宣告複數關鍵字的話只要用空白分隔。假設你有三種效果想要切換就會像這樣宣告。

```hlsl
#pragma shader_feature EFFECT_A EFFECT_B EFFECT_C
```

同時宣告的關鍵字同時只能啟動一個，如果想要同時使用就得獨立宣告，假設現在除了三種效果以外還想要兩種亮度分別就會像這樣宣告。

```hlsl
#pragma shader_feature EFFECT_A EFFECT_B EFFECT_C
#pragma shader_feature LIGHT_DARD LIGHT_BRIGHT
```

除此之外，如果是單一效果要開關的話 shader_feature 只要建立一種變體即可。

```hlsl
#pragma shader_feature EFFECT_OPEN
```

multi_compile 就會需要透過雙底線添加空白 (Blank) 關鍵字，表示這是會被關閉的，否則會預設啟用第一個關鍵字。
```
#pragma multi_compile __ EFFECT_OPEN
```

但如果宣告複數關鍵字，想要表示關閉的話 shader_feature 也會需要。

```hlsl
#pragma shader_feature __ EFFECT_A EFFECT_B EFFECT_C
```

註：寫筆記的時候發現這個差異，測試半天才找出原因

<!-- multi_complie vs shader_feature https://zhuanlan.zhihu.com/p/77043332 -->
<!-- https://docs.unity3d.com/2018.4/Documentation/Manual/SL-MultipleProgramVariants.html -->

<!-- So shader_feature makes most sense for keywords that will be set on the materials, while multi_compile for keywords that will be set from code globally. -->

### 變體內容 +

宣告完關鍵字後還需要為變體實做內容，實做的方法是透過靜態分支關鍵字 #ifdef，或是 #if defined() 定義屬於變體關鍵字的範圍。

```
void function()
{
    #ifdef EFFECT_A
        // do some thing...
    #endif
}
```

也可以透過 #else 定義所有情況外的分支，或是有宣告多個變體關鍵字也可以用 #elif 關鍵字判斷。

```
void function()
{
    #ifdef EFFECT_A
        // do some thing...
    #elif EFFECT_B
        // do some thing...
    #elif EFFECT_C
        // do some thing...
    #else 
        // do some thing...
    #endif
}
```

當著色器編譯時，編譯器就會透過靜態分支的條件判斷，生成出多個版本的著色器變體，而使用者在運行時就可以透過設置關鍵字蘭切換變體，來達成接近動態分支的條件效果。

### 切換變體 +

宣告與定義完變體關鍵字後，使用者就可以根據需求切換自己要使用變體。切換變體有兩種方法，材質切換與手動切換。

**材質切換**

透過材質屬性欄位設置讓材質球自動切換開關變體關鍵字。透過 `[Toggle(Keyword)]` 可以簡單的設定變體開關。

```shaderlab
Properties
{
    [Toggle(EFFECT)] EFFECT ("Enable EFFECT Keyword", Float) = 1.0
}
SubShader
{
    #pragma shader_feature EFFECT

    // 
}
```

{{< resources/image "keyword-properity.jpg" >}}

除了開關以外，還有更多種材質切換用的屬性可以使用，可以參考 Unity 文檔 (MaterialPropertyDrawer)[https://docs.unity3d.com/ScriptReference/MaterialPropertyDrawer.html]。

Unity 的預設材質 Standard 就是利用材質切換變體，一些特殊的計算就只有放入對應的貼圖時才會啟用（如法線貼圖）。要注意的是這種切換方法是由編輯器執行的，因此變體會在運行階段前就切換就完成了，你沒辦法在運行階段透過修改屬性 `material.SetFloat("_Keyword", 0)` 切換變體。

同理，就算你在運行時把 Normal Map 移除，這個材質還是會進行 Normal 計算，即使沒有任何效果。

<!-- https://docs.unity3d.com/ScriptReference/MaterialPropertyDrawer.html -->
<!-- https://docs.unity3d.com/Manual/shader-keywords.html#stage-specific-keywords -->
<!-- https://zhuanlan.zhihu.com/p/77043332 -->

**手動切換**

如果想要在運行階段切換變體，也可以用程式調用函式啟用與禁用變體關鍵字，透過 EnableKeyword 與 DisableKeyword 開關特定關鍵字。

```cs
material.EnableKeyword("Keyword");
material.DisableKeyword("Keyword");
```

除了對特定的材質求設定變體，也可以用全域的方式進行設定，所有有宣告變體關鍵字的著色器都會一次修改。可以用在全局視覺設定上，如草木材質的頂點晃動等等。

```cs
Shader.EnableKeyword("ANIM_SHAKE");
CommandBuffer.EnableShaderKeyword("ANIM_SHAKE");
```

要注意 EnableKeyword <r> 切換時並不會自動關閉其他 Keyword </r> 需要手動透過 DisableKeyword 關閉原本的變體才行。

註：如果關閉關鍵字沒有正常運作，可以看一下筆記的宣告部份，是否為缺少 Blank 關鍵字的問題。

### 優點缺點 +

變體著色器的主要優點為不用擔心動態分支，也能達成切換效果的功能。但缺點是編譯時會生出一拖拉庫變體著色器，會減慢編譯速、增加檔案大小與提高實時的 GPU 記憶體用量。

註：Unity 官方把有一大堆變體的著色器叫做 "mega shaders"，引擎預設的 Standard Shader 就屬於這類。

此外，它還是無法達成「真正」的動態判斷，所以只適合用在開關效果與切換類的條件判斷上。所以得用動態分支的時候還是得用。

### 建置設定 +

如果透過 shader_feature 生成變體的話，專案建置還需要進行額外設定才能運作。透過資料夾右鍵 > Create > Shader > Shader Variant Collection 建立出著色器變體合集，並進行設置。

{{< resources/image "shader-variant-collection-create.jpg" >}}

{{< resources/image "shader-variant-collection.jpg" >}}

最後在保存在 Project Setting > Graphics > Shader Loading > Preloaded Shader 當中

{{< resources/image "shader-variant-loading.jpg" >}}

## 總結 +

因為遇到需要開關效果的情況，當時苦惱了許久，查了些資料後雖然是透過變體著色器達成效果開關，但總覺的不夠理解。所以寫了這篇筆記，把查到的資料重新整理和實驗過後，對各種情況適合的解法更有概念了。

可惜動態分支那裡沒辦法寫更細，之後等研究著色器中的流程控制會在針對那部份解釋。總之，希望這篇筆記也能提供各位一個方向。

### 參考資料

這好像是我第一次那麼認真讀官方文檔ㄏㄏ

https://docs.unity3d.com/Manual/shader-variant-collections.html


https://docs.unity3d.com/Manual/shader-keywords.html


https://docs.unity3d.com/Manual/SL-MultipleProgramVariants.html

https://zhuanlan.zhihu.com/p/190233160


<!-- https://chrislin1015.medium.com/unity%E6%89%8B%E6%9C%AD-multi-compile%E8%88%87shader-feature%E7%9A%84%E5%B7%AE%E7%95%B0-feat-materialpropertydrawer-241b61da2db8 -->








