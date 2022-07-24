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

因為學習過程遇到需要開關特效的情況，所以深入研究了一下著色器的條件判斷與 Unity 變體著色器的應用，這是我在翻閱資料與試錯後總結出的學習筆記，在這裡分享給各位。

<!--more-->

## 條件判斷 +-

由於特化後的硬體架構讓 GPU 能利用多個核心同時進行運算，以並行的方式高效完成任務，但也相對捨去了執行複雜行為的能力：條件判斷。

不過捨去並不代表完全無法使用，只是需要付出更高的成本而已，著色器中還是有三種方法能達成條件判斷的目的：靜態分支、動態分支與數學判斷。

### 靜態分支 +-

靜態分支 (Static Branch)，是一種會在編譯時進行的條件判斷，編譯器會直接將不符和條件的分支排除，編譯後的程序將只會存在符合條件的內容。靜態分支的編寫方式為預處理關鍵字 `#` 加上條件式，如 `#if` `#else`  `#ifdef` 等等，並透過 `#endif` 表示判斷範圍的尾端。

```hlsl
#if 
    // do some thing...
#else
    // do some thing...
#endif
```

<!-- https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-appendix-pre-if -->

除此之外，如果編寫一般的條件式但使用編譯後固定的常量作為條件 (compile-time constant value)，編譯器檢測到也會自動將它作為靜態分支判斷進行判斷，排除不符合條件的內容。

```hlsl
static const float version = 0;

fixed4 frag (v2f i) : SV_Target
{
    if(version < 5)
    {
        do some thing...    
    }
}
```

<p><c>
註：在 Unity 中可以透過 Shader Inspector 的 Compile and show code 查看編譯後的結果。
</c></p>

<!-- https://gamedev.stackexchange.com/questions/84166/in-hlsl-what-is-the-difference-between-static-const-and-define-for-constan -->

+ **優點**  
    靜態分支的主要優點是不會有任何實時運行上的負面影響，因為判斷工作已經在編譯時完成了。同時因為直接排除無用分支的原因，也會減低編譯後的程序大小。

+ **缺點**  
    最主要的缺點就是它也只能在編譯時做判斷，所以能作到的工作比較侷限，如果想要在實時根據條件改變某些東西就無法達成。

靜態分支通常會應用在為特定硬體或環境編譯的著色器，畢竟遊戲環境不會玩一玩突然改變，只需要在開始時選擇正確的版本就好。

<!-- https://docs.unity3d.com/Manual/shader-branching.html#static-branching -->

```hlsl
#if SHADER_TARGET < 30
    // less than Shader model 3.0:
    // very limited Shader capabilities, do some approximation
#else
    // decent capabilities, do a better thing
#endif
```
<!-- https://docs.unity3d.com/Manual/SL-BuiltinMacros.html -->

### 動態分支 +-

動態分支 (Dynamic Branch)，指的是在著色器運行時進行的條件判斷，能根據即時條件獲得不同結果。編寫方式和一般的判斷式相同。

```hlsl
if(condition)
{

}
else
{

}
```

基於 GPU 的特殊硬體架構，著色器在遇到動態分支的時候會有兩種可能的行為。

1. 只計算符合條件的部份，這會導致不同執行序中的運算內容不同，破壞並行性。
2. 扁平化計算，把所有分支上的計算都執行完畢，再拋棄不要的結果，保持並行性但會導致多餘的計算。

無論何者都會對效能產生負面影響，並且 GPU 在遇到分支時必須為最壞的情況預留暫存器 (Register) 空間，假如不同分支的計算成本差距過大，在它在執行低成本的分支時就會浪費那些預留的空間，這也是動態分支的缺點之一。

<!-- Branching based on non-uniform variables means that the GPU must either perform different operations at the same time (and therefore break parallelism), or “flatten the branch” and maintain parallelism by performing the operations for both branches and then discarding one result. Branching based on uniform variables means that the GPU must flatten the branch. Both of these approaches result in reduced GPU performance. -->

<!-- https://docs.unity3d.com/Manual/shader-branching.html#dynamic-branching -->

此外，動態分支視判斷條件的內容也有兩種類別：

**uniform variable**

使用 uniform 變數作為判斷條件，並且條件的所有分支成本相近。因為 unifrom 是全域只讀的，所以相同條件的判斷式基本都會走在同一條分支上，而分支成本相近的話也不會浪費太多暫存器空間。

如此一來，雖然是動態分支但整體的計算環境還是相較穩定，是比較理想的使用情況。

```hlsl
uniform bool u_Condition;

if(u_Condition)
{

}
else
{

}
```

**non-uniform variable**

使用完全的動態變數作為判斷條件，可能每個材質甚至每個像素走得分支都不同，這種情況下效能表現就會比較差，但要深掘原因的話可能要獨立幾篇筆記才夠，所以先點到為止。

```hlsl
float value;

if(value > 10)
{

}
```

而動態分支的優點就是允許使用動態變數做判斷，讓使用者能做到的事情多很多。會使用的情況就是無法編寫成靜態分支但又真的條件判斷時，在計算著色器中就很常使用，例如 GPU Culling。

```hlsl
void CullingKernal (uint3 id : SV_DispatchThreadID)
{
    if(id.x >= instanceCount) return;

    float4x4 transformMatrix = transformBuffer[id.x];

    if(viewPortCulling(transformMatrix)) return;

    cullResultBuffer.Append(transformMatrix);
}

```

### 數學判斷 +-

數學判斷，透過函式或乘法計算達成類似條件判斷的效果。最常見的是透過 `step(edge, value)` 函式來開關效果，這個函式會在 value > edge 時回傳 1，反之 0，利用這個特性就能達成開關功能。

```hlsl
float result = effect * step(edge, value);
```

或是將它放在 lerp 的權重輸入裡，也能達成 if else 的效果。

```hlsl
float result = lerp(resultA, resultB, step(edge, value));
```

數學判斷的優點是，有時候條件就是動態的變數，直接寫成計算式反而比條件簡潔。但缺點是沒用到的部份也會進行計算，而且判斷條件稍微複雜就會很難維護。數學判斷與扁平化類似，但即使如此也不要把硬把判斷式轉換成數學判斷，大多情況下這只會是負優化。該用判斷式的時候就是去用，要優化編譯器會幫你完成的。

數學判斷比較常用在特效類的計算上，尤其是具有距離場性質的計算。例如經典的溶解特效就是一個例子。

```hlsl
fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = tex2D(_MainTex, i.uv);

    float dissolve = tex2D(_NoiseMap, i.uv).r;
    col.a = step(_Filter, dissolve);
    
    return col;
}
```

{{< resources/image "math-dissolve.gif" >}}

## 變體著色器 +-

變體著色器 (Shader Variant)，由 Unity 引擎提供的一種特殊方法，透過不同的關鍵字分割著色器區塊，在編譯時透過靜態分支編譯出多個版本的變體著色器，如此一來就能透過切換變體在實時達到接近動態分支的效果。

### 變體關鍵字 +-

關鍵字有兩種類別 `multi_compile` 與 `shader_feature`，筆記中統一使用 `shader_feature`，有差異的部份會在進行補充。

透過 `#pragma` `shader_feature` `KEYWORD_TYPE` 進行宣告，命名規範為全大寫，透過一個底限分隔類別，如果要宣告複數關鍵字的話只要用空白分隔。假設你有三種效果想要切換就會像這樣宣告。

```hlsl
#pragma shader_feature EFFECT_A EFFECT_B EFFECT_C
```

同時宣告的關鍵字只能啟動一個，如果想要使用複數就得獨立宣告。假設現在除了三種效果以外還想要兩種亮度分別就會像這樣宣告。

```hlsl
#pragma shader_feature EFFECT_A EFFECT_B EFFECT_C
#pragma shader_feature LIGHT_DARD LIGHT_BRIGHT
```

除此之外，如果是單一效果要開關的話 shader_feature 只要建立一種變體即可。

```hlsl
#pragma shader_feature EFFECT_OPEN
```

而 multi_compile 就會需要透過雙底線添加空白 (Blank) 關鍵字，表示這是會被關閉的，否則會預設啟用第一個關鍵字。

```hlsl
#pragma multi_compile __ EFFECT_OPEN
```

但如果宣告複數關鍵字，想要表示關閉的話 shader_feature 也會需要底線。

```hlsl
#pragma shader_feature __ EFFECT_A EFFECT_B EFFECT_C
```

<!-- multi_complie vs shader_feature https://zhuanlan.zhihu.com/p/77043332 -->
<!-- https://docs.unity3d.com/2018.4/Documentation/Manual/SL-MultipleProgramVariants.html -->

<!-- So shader_feature makes most sense for keywords that will be set on the materials, while multi_compile for keywords that will be set from code globally. -->

### 變體內容 +-

宣告完關鍵字後就需要為變體實做內容，實做的方法是透過靜態分支關鍵字 `#ifdef`，或是 `#if defined()` 定義屬於關鍵字的範圍。也可以透過 `#else` 定義所有情況外的分支，或是有宣告多個變體關鍵字也可以用 `#elif` 關鍵字判斷。

```hlsl
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

當著色器編譯時，編譯器就會生成出多個版本的著色器變體，而使用者在運行時就可以透過設置關鍵字切換變體，達成接近動態分支的條件效果。

### 切換變體 +-

宣告與定義完變體關鍵字後，使用者就可以根據需求切換要使用變體。變體切換有兩種方法，材質切換與手動切換。

**材質切換**

在材質屬性欄位添加標籤，讓材質球自動開關變體關鍵字。透過 `[Toggle(Keyword)]` 可以簡單的設定變體開關。

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

除了開關以外，還有更多種材質切換用的屬性可以使用，可以參考 Unity 文檔 [Material Property Drawer](https://docs.unity3d.com/ScriptReference/MaterialPropertyDrawer.html)。

Unity 的預設著色器 Standard 就是利用材質切換變體，一些特殊的計算就只有放入對應的貼圖時才會啟用（如法線貼圖）。要注意的是這種切換方法是由編輯器執行的，因此變體會在運行階段前就切換就完成了，你沒辦法在運行階段透過修改屬性 `material.SetFloat("_Keyword", 0)` 切換變體。

同理，就算你在運行時把 Normal Map 移除，這個材質還是會進行 Normal 計算，即使沒有任何效果。

<!-- https://docs.unity3d.com/ScriptReference/MaterialPropertyDrawer.html -->
<!-- https://docs.unity3d.com/Manual/shader-keywords.html#stage-specific-keywords -->
<!-- https://zhuanlan.zhihu.com/p/77043332 -->

**手動切換**

如果想要在運行階段切換變體，可以用調用函式 `EnableKeyword` 與 `DisableKeyword` 來啟、禁用特定關鍵字。要注意 <r> 切換時並不會自動關閉其他 Keyword </r> 需要手動透過 `DisableKeyword` 關閉原本的關鍵字才行。

```cs
material.EnableKeyword("Keyword");
material.DisableKeyword("Keyword");
```

除了對特定的材質求設定變體，也可以用全域的方式進行設定，所有宣告過關鍵字的著色器都會一次修改。可以用在全局視覺設定上，如草木材質的頂點晃動等等。

```cs
Shader.EnableKeyword("ANIM_SHAKE");
CommandBuffer.EnableShaderKeyword("ANIM_SHAKE");
```

### 優點缺點 +-

變體著色器的主要優點為不用擔心動態分支，也能達成切換效果的功能。但缺點是編譯時會生出一拖拉庫變體著色器，會減慢編譯速、增加檔案大小與提高實時的 GPU 記憶體用量。此外，它還是無法達成「真正」的動態判斷，只適合用在開關效果與切換類的條件判斷上，所以得用動態分支的時候還是得用。

<p><c>
註：Unity 官方把有一大堆變體的著色器叫做 "mega shaders"，引擎預設的 Standard Shader 就屬於這類。
</c></p>


### 建置設定 +-

如果透過 `shader_feature` 生成變體的話，專案建置還需要進行額外設定才能運作。在資料夾右鍵 > Create > Shader > Shader Variant Collection 建立出著色器變體合集，並進行設置。

{{< resources/image "shader-variant-collection-create.jpg" >}}

{{< resources/image "shader-variant-collection.jpg" >}}

最後在保存在 Project Setting > Graphics > Shader Loading > Preloaded Shader 當中，這樣建置後的檔案才會有變體著色器。

{{< resources/image "shader-variant-loading.jpg" >}}

## 總結 +-

因為遇到需要開關效果的情況，當時在各種作法之間苦惱了許久，查了些資料後雖然是透過變體著色器達成效果開關，但總覺的不夠理解。所以寫了這篇筆記，把查到的資料重新整理和實驗過後，對各種情況適合的解法更有概念了。

可惜動態分支那裡沒辦法寫更細，之後等研究著色器中的流程控制會在針對那部份解釋。總之，希望這篇筆記也能提供各位一個方向。

### 參考資料

題外話：這好像是我第一次那麼認真讀官方文檔ㄏㄏ

https://docs.unity3d.com/Manual/shader-variant-collections.html


https://docs.unity3d.com/Manual/shader-keywords.html


https://docs.unity3d.com/Manual/SL-MultipleProgramVariants.html

https://zhuanlan.zhihu.com/p/190233160


<!-- https://chrislin1015.medium.com/unity%E6%89%8B%E6%9C%AD-multi-compile%E8%88%87shader-feature%E7%9A%84%E5%B7%AE%E7%95%B0-feat-materialpropertydrawer-241b61da2db8 -->








