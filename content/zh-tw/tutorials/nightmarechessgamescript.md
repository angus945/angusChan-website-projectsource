---
title: "七萬行硬編碼寫出的西洋棋"
date: ---
lastmod: ---
draft: true
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
important: 10

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


## 前言

心情還是在超級複雜的情況，來聊些有趣的東西吧。前陣子和朋友聊到西洋棋遊戲設計的事情，我就想到之前做過一個有趣的東西，一個用 windows from 的西洋棋遊戲，那是在我剛學程式時做的玩意。
{{< pathImage "ChessGame.jpg" "80%" >}}

一個普通的西洋棋遊戲，需要在本機由兩個人輪流控制來對弈，遊戲沒有 AI 也沒有連線，為什麼要特別把他拿出來說呢？因為這個腳本裡有七萬行 code
{{< pathImage "thousandLineOfcodes.jpg" "80%" >}}

沒有 AI 也沒有連線，為什麼有那麼多行程式？...就像標題說的，那時我連 function 和 class 的觀念都沒有，所以全部內容都是靠 hard code 雕出來的。

總之，這個腳本踩了「幾乎所有」程式或遊戲程式設計中的地雷，是堪稱完美的負面教材。有那麼好的教材不用也可惜，這篇文章就讓我把裡面踩到的地雷一個一個點出來，由簡入深。

### 注意事項

1. 在文章的程式區塊中，我會透夠註解來表示哪些是原始內容，哪些是修正過後的。而範例中的程式以是 C# 為主，有些部份會是 fake code，僅用於展示範例和觀念。

2. 這篇文章的定位比較像是學習路徑指南而非教學，因此每段落的內容可能不會過於深入。但你們可以透過不同段落的內容大致判斷自己的能力階段，並作為更進一步學習的基準。

<!-- 3. 部分程式碼可能令人產生不適感 -->

{{< pathLink "完整腳本點我 Form1.cs" "Form1.cs" >}}
<!-- 
### 名詞備註

+ 程式腳本 Script
    通常我們會稱呼編寫程式碼的那個文字文件為 Script，文中 
    
+ 三元運算子

層層推翻的
上一層的修正範例可能又會在下一層被推翻
    
可讀性、可維護性、可擴展性
    
-->




## 由簡入深

讓我們開始吧～

### 難辨識的命名 +

<!-- 但是，請看以下的程式碼，這些是腳本最一開始宣告的各種變數，用於紀錄西洋棋遊戲的各種狀態。 -->

這個腳本裡的第一個問題便是命名。首先讓我們看看一開始的按鈕陣列，由於需要介面與玩家進行互動，我透過按鈕排列出棋盤的樣子，並在程式中宣告了一個二維的 Button 陣列去對應每個格子。

```cs
//原始腳本 19 行
Button[,] but = new Button[8, 8];
string[] chess = new string[6];
```

陣列的名稱叫做 but，概念是 button 的縮寫，忽略掉名詞複數的問題，這樣取名雖然能有效表達陣列中的元素，但無法讓我們知道這個陣列的確切用途。按鈕的用途太多了，在我們的情況中它還代表了棋盤格，因此更好的命可以改為 `tileButtons` 或 `gridButtons`。

接著往下看，我還使用了 `a, b, c, d, f` 來命名某些 `int` 變數，即使我自己再看程式也不知道他們的用途是什麼。至於後面幾個 `bool` 變數，雖然我能透過註解回想起用途，但還是相當不直觀。

```cs
//原始腳本 21～24 行
string start;           //移動(不要刪錯!!!!!!!!!!!!)
int a;                  //次數
int b, c;
int d, f;
bool pass = false;        //輪流
bool white = false;          //白棋國王
bool black = false;         //黑棋國王
```

所有的命名都必須要有意義，因為這是最直接影響程式可讀性的因素，不要用 int a, b, c 這種不具有意義的名稱，或是難以理解用途的名稱，例如那個 start 變數，從註解就能看出我很常誤刪他。這裡將以上的程式進行修正。

```cs
//更好的命名，中間幾個我自己也看不懂用途，就先刪了
Button[,] tileButtons = new Button[8, 8];
string[] chesses = new string[6];

int clickX, clickY; //原本的 b 和 c

bool currentTurn = false;    
bool whiteKingSurvive = false;       
bool blackKingSurvive = false;       
```

> 所有的命名都必須要有意義

雖然剛入門的新手可能會從做題開始，不會使用到太多種的變數，但還是建議盡早訓練命名能力，長期來說這是相當重要的。

臨時的就叫 ```temporary, temp```

記數的就叫 ```number, amount, count```

貓狗車就叫 ```dog, cat, car```

當然迴圈變數也是根據用途命名的，i 是 index 的簡寫，如果你要遍歷陣列 ```arrayElement[i]``` 就很適合。
但如果你不是直線遍歷，像 2 維以上的陣列，迴圈有多層，就用座標軸當名稱會更適合，如 `x, y`。

```cs 
for (int x = 0; x < length; x++)
{
    for (int y = 0; y < length; y++)
    {
        // arrayElement[x,y] do some thing
    }
}
```

如果你不知道如何判斷名稱命的好壞，就根據自己能不能「一眼看出用途」當作基準，如果不行，或理解出的意思有偏差，就代表需要 Rename。不用擔心名稱過長，可以透過駝峰命名法來提高辨識度。

訓練出命名能力後，不只你的程式可讀性會更高，你在看到其他新函式的時候透過名稱推估出大略功能，因為你知道那些命名都是有意義的。不同語言使用的規則可能略有差異，更多資料可以透過命名規則或是 Coding Style 找到。

關鍵字：Coding Styles, Naming Rules, Camel-Case

### 硬編碼的數值 +

在編寫腳本時，無論是建立陣列、編寫迴圈，或是函式調用與物件實例，都可能遇到需要將變數作為參數輸入的狀況。
而在我的西洋棋程式中，首先遇到的情況便是按鈕陣列的大小，因此我也直接將參數輸入建構器 `new Button[8, 8]`。此外，在後續的迴圈中，我也將中斷條件設置為 `i < 8`。 

```cs
//原始腳本 19, 20 與 57～101 的迴圈
Button[,] but = new Button[8, 8];
string[] chess = new string[6];

for (int j = 0; j < 8; j++)
{
    for (int i = 0; i < 8; i++)
    {
        if (but[j, i].BackColor == Color.White)
        {
            but[j, i].ForeColor = Color.White;
        }
    }
}
```

這樣寫雖然能有效運作，但我們可以思考一下這些參數有什麼共通點。是相同數值嗎？數值相同是沒錯，但還不夠精確，好的說法應該是相同「意義」。這個 8 代表的是棋盤格的寬高，西洋棋棋盤是由 8x8 的網格建立的，因此我將 8 「直接」作為按鈕陣列與迴圈的參數輸入。

但實際上，我們在編寫程式時，無論是陣列大小或迴圈的次數，程式是不在乎確切數值有「多少」的，他們只在乎數值的「意義」為何。為什麼今天輸入的數值是 8？因為 8 是我的棋盤大小。如果棋盤大小為 7，陣列就會是 7x7；如果棋盤大小為 9，陣列便建立為 9x9 的大小。

{{< text/greenLine >}}
註：這段話是程式設計層面的，而非程式執行層面，執行層面的話程式當然在乎確切數值
{{</ text/greenLine >}}

因此我們可以將棋盤大小的數值 8 提取出來，儲存在變數當中，並將變數分配進原先使用數值的地方。

```cs
//修正後的程式，將數值提取出來
int boradSize = 8;
int chessesType = 6;

Button[,] tileButtons = new Button[boradSize, boradSize];
string[] chesses = new string[chessTypes];

for (int x = 0; x < boradSize; x++)
{
    for (int y = 0; y < boradSize; y++)
    {
        // tileButtons[x, y] do some thing
    }
}
```

這樣做的好處，第一就是能更輕易的修改數值，如果我想要把棋盤格擴大到 16，只需要尋找變數位置進行修改，而非尋找每個使用到數字的地方。再來是可讀性提升，透過變數的命名，我們也能更輕鬆的看出數值的意義，並推測出迴圈的用途。

### 未簡化的程式 +

在按鈕程式的前半段，為了讓棋盤格有相間的顏色，我使用大量的迴圈重複疊加出效果。

用跳的跳到要上色的格子

```cs
//原始腳本第 74 至 101 行
for (int h = 0; h < 8; h += 2)                                          //還原
{
    for (int hh = 0; hh < 8; hh += 2)
    {
        but[h, hh].BackColor = Color.DimGray;
    }
}
for (int h = 1; h < 8; h += 2)
{
    for (int hh = 1; hh < 8; hh += 2)
    {
        but[h, hh].BackColor = Color.DimGray;
    }
}
for (int h = 1; h < 8; h += 2)
{
    for (int hh = 0; hh < 8; hh += 2)
    {
        but[h, hh].BackColor = Color.Gainsboro;
    }
}
for (int h = 0; h < 8; h += 2)
{
    for (int hh = 1; hh < 8; hh += 2)
    {
        but[h, hh].BackColor = Color.Gainsboro;
    }
}
```

雖然這樣能有效繪製出棋盤格，但整體程式過於冗長，實際上後面三個迴圈都是多餘的。我們只需要用一次迴圈遍歷過，並判斷該位置要上的顏色為何便可。

想要達成交錯上色的話，可以根據格子所在位置的奇偶數進行判斷，只需要透過取餘運算子 %，除二取餘就能知道當前格子為單數格還是雙數格。只要在奇數行的偶數格上黑色，並在偶數行的奇數上黑色，就能繪製出相間的棋盤格。

```cs
//簡化後的程式碼，透過判奇偶格子上色
for (int x = 0; x < boradSize; x++)
{
    for (int y = 0; y < boradSize; y++)
    {
        Color tileColor;
        bool evenRow = x % 2 == 0;
        bool evenColumn = y % 2 == 0;
        if(evenRow)
        {
            tileColor = evenColumn ? Color.DimGray : Color.Gainsboro;
        }
        else
        {
            tileColor = evenColumn ? Color.Gainsboro : Color.DimGray;
        }
        tile[x, y].BackColor = tileColor;
    }
}
```

雖然透過奇偶判斷能夠將迴圈減少到剩一個，但內部的判斷式還是過於冗長。
我們把上色的邏輯再簡化一次看看，將一行的奇數格上黑色、偶數格上白色，而下一行將黑白（奇偶）反轉。

我們實際上不需要將行與列分開看，能夠透過行數直接達成反轉效果。
因為奇數 + 偶數 = 奇數、奇數 + 奇數 = 偶數，當我們將行數與列數相加，偶數行的奇數還是奇數，但奇數行的奇數會變為偶數，如此就能直接達到反轉的效果了。

```cs
//最簡化後的棋盤交錯上色
for (int x = 0; x < boradSize; x++)
{
    for (int y = 0; y < boradSize; y++)
    {
        int colorIndex = (x + y) % 2;
        Color tileColor = colorIndex == 0 ? Color.DimGray : Color.Gainsboro;
        tile[x, y].BackColor = tileColor;
    }
}
```

透過數學算法能有效能夠簡化非必要的內容，讓程式碼更簡潔也更高效。實際上這個問題就和解題時遇到從 0 加到 100 的題目是類似的，雖然能直接透過迴圈計算，但更好的作法是透過梯形公式 (0 + 100) * 100 / 2 進行數學解。

但無論是相加的題目，又或者範例中的棋盤上色，重點都在於改變思維方法，而非真的要計算 1 加到 100 的結果。

<!-- 試著轉換思維 -->

### 未整理的架構 +

在製作這個遊戲時，我還沒學到任何 function 的觀念，那時只知道 `Form1_Load()` 會在一開始執行，而點兩下按鈕會產生 `button_Click()`，裡面寫的東西會在按鈕按下時觸發。為了讓界面的按鈕能與玩家互動，在按鈕中編寫了西洋棋遊戲的相關邏輯。

```cs
//原始腳本第 55～1145 行
//對，有一千行，所以請不要嘗試細看原始程式
private void button1_Click_1(object sender, EventArgs e)
{
    b = 0;                                      
    c = 0;
    for (int j = 0; j < 8; j++) { }
    for (int i = 0; i < 8; i++) { }     //重製(整面)
    for (int h = 0; h < 8; h += 2) { }  //還原
    for (int h = 1; h < 8; h += 2) { }
    for (int h = 1; h < 8; h += 2) { }
    for (int h = 0; h < 8; h += 2) { }

    if (pass == false) { }              //回合 白
    else { }                            //回合 黑

    for (int j = 0; j < 8; j++) { }      
}    
```

從上面的程式可以看出我直接將所有程式都直接寫在按鈕事件 `button1_Click_1()` 中，雖然程式運行起來是有效的，但會導致整體難以維護。
除了運作流程難以辨識，如果出現某個 bug 的話，你也會更難定位到出錯的位置，也需要花更多時間理解程式的前後關係。

因此，我們可以將這一大片程式碼根據運作內容進行拆分，透過 function 將它們打包為三個部份，重置棋盤、檢測按鈕狀態與清除狀態。

```cs
//修正過後的程式碼，將它們拆分為幾項重點流程
void button1_Click_1(object sender, EventArgs e)
{
    ResetBorad();
    ClickCheses();
    ClearBorad();
}
void ResetBorad() { }
void ClickCheses() { }
void ClearBorad() { }
```

光是整理到這種程度，可讀性就顯著提高了，不需要細看每段程式的內容也能大致理解運作流程。假設現在棋盤的清除工作出錯時，我就知道問題可能出在 `ClearBorad()` 當中，而不需要從整片 code 裡尋找錯誤。

如果想再更進一步拆分工作，也可以將細分的 function 再分的更細。初始化部份的迴圈大致可以拆成三個部份，重置顏色、重置選取和重新上色棋盤。

```cs
//將 ResetBorad 的內容再拆分的更細
void ResetBorad() 
{
    ResetColor();
    ResetSelect();
    RepaintBorad();
}
void ResetColor() { }
void ResetSelect() { }
void RepaintBorad() { }
```

如此一來，當 ResetBorad() 中的某個環節出錯，你也能更輕鬆且更精確的定位到具體位置上。

而且拆分完畢後，你也更容易注意到多餘的內容，像是 `ResetColor()` 和 `RepaintBorad()` 的本質都是繪製，可以合併進一個 function 裡面，沒必要被分隔開來。透過 function 將完整工作拆成多個小塊，能顯著提昇可讀性與可維護性。


### 高重複性內容 +

在 hard code 一大堆判斷和迴圈之後，為了讓其他按鈕也有效果，我把程式碼複製貼上到所有按鈕的 Click 函式裡，光是這點就造成了腳本有九成內容都是無意義重複。

```cs
//原始程式 53 至 70230 行，現在你們知道為什麼腳本會那麼長了吧...
private void button1_Click_1(object sender, EventArgs e)
{
    //all codes in chess game, ctrl + c
}
private void button2_Click(object sender, EventArgs e) 
{ 
    //ctrl + v
}
//button3_Click, button4_Click, button5_Click...button65_Click
```

我們只需要透過 function 就可以將內容打包，並讓其地方調用能夠直接有效的降低重複性。

```cs
//修正過後的程式
void ButtonClick() 
{ 
    //codes... 
}
button1_Click_() { ButtonClick(); }
button2_Click_() { ButtonClick(); }
//button3_Click, button4_Click, button5_Click...button65_Click
```

不過這種作法只能減少直接的重複，我們還能更進一步，透過 function 的輸入與輸出特性，減少不重複但高度相似的程式碼。

下面這段程式碼是棋子「國王」被按下時會做的事，它會將周圍八格的按鈕設置為可選取狀態。但如果國王的位置在棋盤邊界，在訪問陣列元素時可能會發生 index out of array 的狀況，為此我添加了一堆判斷式來防止這種狀況發生。

```cs
//原始程式碼第 118 至 162
private void button1_Click_1(object sender, EventArgs e)
{
    b = 0;
    c = 0;
    //...
    if (but[b, c].Text == chess[0])        
    {
        if (b < 7)                     //不在最上面
        {
            but[b + 1, c].Enabled = true;
            if (c < 7)                     //不在最右邊
            {
                but[b + 1, c + 1].Enabled = true;
            }
            if (c > 0)                     //不在最左邊
            {
                but[b + 1, c - 1].Enabled = true;
            }
        }
        if (b > 0)                     //不在最下面
        {
            but[b - 1, c].Enabled = true;
            if (c < 7)                     //不在最右邊
            {
                but[b - 1, c + 1].Enabled = true;
            }
            if (c > 0)                     //不在最左邊
            {
                but[b - 1, c - 1].Enabled = true;
            }
        }
        if (c < 7)                     //不在最右邊
        {
            but[b, c + 1].Enabled = true;
        }
        if (c > 0)                     //不在最左邊
        {
            but[b, c - 1].Enabled = true;
        }
    }
    //...
}
```

這樣編寫雖然也能防止超出陣列範圍的情況，但導致了整個程式碼相當冗長，而且難以閱讀。可以先觀察一下它們的共通點，以思考出更好的作法。每個部份都是檢查要操作的位置是否超出邊界，並修改按鈕的可選取狀態。

根據觀察出的共通點，我們可以建立一個函式，將我們想修改的棋盤位置輸入，讓它完成檢查工作並設置按鈕的啟用狀態。

```cs
//修正後的程式碼，我會透過函式 if 和 return 限制條件，能避免判斷式的縮排太多層
//這違反函式單一出口的原則，但我選擇以程式整齊優先，看個人的偏好決定，沒有絕對優劣
void SetButtonEnable(int x, int y, bool enable)
{
    if(x >= boradSize || x < 0) return;
    if(y >= boradSize || y < 0) return;
    
    tileButtons[x, y].Enabled = enable;
}
```

如此一來，我們就能省去冗長的判斷條件，棋子只需要將要移動路徑輸入進函式，就能完成判斷和修改選取狀態的工作了。

```cs
void button1_Click_1(object sender, EventArgs e)
{
    clickX = 0;
    clickY = 0;
    //...
    if (but[clickX, clickY].Text == chess[0])        
    {
        SetButtonEnable(clickX + 1, clickY, true);
        SetButtonEnable(clickX - 1, clickY, true);
        SetButtonEnable(clickX, clickY + 1, true);
        SetButtonEnable(clickX, clickY - 1, true);

        SetButtonEnable(clickX + 1, clickY + 1, true);
        SetButtonEnable(clickX + 1, clickY - 1, true);
        SetButtonEnable(clickX - 1, clickY + 1, true);
        SetButtonEnable(clickX - 1, clickY - 1, true);
    }
    //...
}

```

這次我故意不省略太多初始程式，為的就是展示重構前後的對比。將重複內容提取出來後，除了省去大量的相似內容，還獲得了可觀的可讀性與架構整齊度。

{{< text/greenLine>}}
然後這樣執行判斷的「次數」的確會提高，但基本上還是能忽略的等級，最後會談到
{{</ text/greenLine>}}

以上兩種與 function 有關的觀念，我選擇把架構放在降低重複前面，主要原因是整理架構相對來說比較簡單。很多時候整理完架構，重複的類容也一目了然了，而減少相似程式也需要比較多的經驗。

至於兩者的重要性則因人而異，雖然在重構程式時兩者很少單獨出現（如第二項範例，簡短重複的同時又使架構更乾淨），但真的要擇一的話我是以架構整齊優先的，自己根據需求或偏好決定吧。

### 邏輯綁定視覺 +

為了檢測玩家選擇的棋子，我會在玩家按下按鈕時，檢測按鈕上的「文字內容」來判斷玩家選擇的棋子。不只如此，當時我還把所有的遊戲邏輯也寫進按鈕中。

```cs
//原始腳本第 118 至 535 行
string[] chess = new string[6];
private void button1_Click_1(object sender, EventArgs e)
{
    b = 0;
    c = 0;
    
    //...
    if (but[b, c].Text == chess[0]) { }
    else if (but[b, c].Text == chess[1]) { }
    else if (but[b, c].Text == chess[2]) { }
    else if (but[b, c].Text == chess[3]) { }
    else if (but[b, c].Text == chess[4]) { }
    else if (but[b, c].Text == chess[5]) { }
    //...
}
```

為了保持程式的維護性，通常我們會希望將不同「程式概念」進行分離，最基礎的就是將「視覺」與「邏輯」進行拆分。按鈕是 UI 界面，也就是視覺的部份，它不應該「具有」遊戲邏輯與遊戲狀態的資訊，視覺只是用來「展示」資訊，將資訊傳遞給玩家的手段而已。

為什麼要將兩者分離呢？舉個簡單的例子，假設我今天想修改介面顯示棋子的方式，使用不同元素繪製棋盤格，例如圖片，就必須要動到整個核心程式碼，才能將文字顯示的部分修改為圖片。這是不合理的，因為無論我怎麼修改視覺的表現方式，只要遊戲規則不變，邏輯相關的程式碼也不應該改變。

更好的作法是將在按鈕按下時，將必要的資訊（如格子座標）傳遞給內部邏輯，按鈕也只會接收當前的棋盤狀態（或更少資訊），將棋子分佈透過視覺展示給玩家，而於遊戲邏輯則與它毫無關聯。

我們可以另外建立一個陣列，作為棋盤網格的實際狀態，按鈕陣列僅用於視覺顯示，以此來分離視覺與邏輯。當按鈕被按下時，透過按鈕位置提供的座標，映射到內部的邏輯網格。

```cs
//修正過後的大略樣子
int[,] chessGrid = new int[boradSize, boradSize];
button[,] uiButtonGrid = new button[boradSize, boradSize];

void TileButtonClick(int x, int y)
{
    int selectChess = chessGrid[x, y];
    //other logic...
}

//buttons click
void button1_Click(object sender, EventArgs e)
{
    TileButtonClick(0, 0);
}
void button2_Click(object sender, EventArgs e)
{
    TileButtonClick(0, 1);
}
```

而視覺的部份，只需要在每次棋盤狀態改變時，進行一次更新即可。陣列遍歷一次真實的棋盤網格，並在按鈕網格上對應的位置畫上棋子。

```cs
//修正後的大略樣子
void UpdateVisual()
{
    for (int x = 0; x < boradSize; x++)
    {
        for (int y = 0; y < boradSize; y++)
        {
            int chessIndex = chessGrid[x, y];
            Button updateTile = uiButtonGrid[x, y];
            
            updateTile.text == chess[chessIndex];
        }
    }
}
```

如此一來，界面的按鈕就和我們的遊戲邏輯分離了。當我們修改遊戲邏輯時，只需要改變 `TileButtonClick()` 中的程式碼，而改變視覺時也只需要修改 `UpdateVisual()` 的內容即可，兩者不再會直接產生影響，可維護性大大提高。

如果還想要拆分的更細，也能分成三等份，將視覺、邏輯、數據進行拆分，不過文章這裡就點到為止。

### 沒有物件導向 -

棋子、棋盤、玩家都是物件

透過物件導向可以讓架構更加乾淨

首先，可透過 struct 將多種數據進行打包
例如座標，原先我們使用兩個 int 當作座標的 x, y 軸數值。

向量

```cs
public struct Vector
{
    int x, y;
    public Vector operator +(Vector a, Vector b)
    {
        return new Vector(a.x - b.x, a.y - b.y);
    }
}
```

也可以透過繼承方法來

每種棋子都是獨立物件，不再需要使用判斷式

如此一來也能將每種棋子的行為分離

```cs
public abstract class BaseChess
{
    Vector position;
    public abstract bool ChessMovement(Vector movement);
}
public abstract class KingChess
{
    public override bool ChessMovement(Vector movement)
    {
        //return is movement vaild
        //如果移動位置是棋子的周圍八格，回傳 true
    }
}
```

```cs
public class ChessBoard
{
    Vector boardSize;
    BaseChess[,] chessGrid;
    
}

```
能夠

將架構整理的更整齊

拆分的更細

<!-- 關鍵字：Object Oriented Programming -->

### 多餘手動作業 -

寫程式很大的目的就是要降低重複作業

這裡的場景指的是棋盤，我那時用的是 button 當作棋盤的格子

但我沒有用程式生成這些按鈕，而是在編輯界面一個個排好之後，

硬編碼手動指定網格對定的按鈕

```cs
//原始腳本第 28～45
Button[,] but = new Button[8, 8];
private void Form1_Load(object sender, EventArgs e)
{
    but[0, 0] = button1; but[0, 1] = button2; but[0, 2] = button3; but[0, 3] = button4; but[0, 4] = button5; but[0, 5] = button6; but[0, 6] = button7; but[0, 7] = button8;

    but[1, 0] = button9; but[1, 1] = button10; but[1, 2] = button11; but[1, 3] = button12; but[1, 4] = button13; but[1, 5] = button14; but[1, 6] = button15; but[1, 7] = button16;

    but[2, 0] = button17; but[2, 1] = button18; but[2, 2] = button19; but[2, 3] = button20; but[2, 4] = button21; but[2, 5] = button22; but[2, 6] = button23; but[2, 7] = button24;

    but[3, 0] = button25; but[3, 1] = button26; but[3, 2] = button27; but[3, 3] = button28; but[3, 4] = button29; but[3, 5] = button30; but[3, 6] = button31; but[3, 7] = button32;

    but[4, 0] = button33; but[4, 1] = button34; but[4, 2] = button35; but[4, 3] = button36; but[4, 4] = button37; but[4, 5] = button38; but[4, 6] = button39; but[4, 7] = button40;

    but[5, 0] = button41; but[5, 1] = button42; but[5, 2] = button43; but[5, 3] = button44; but[5, 4] = button45; but[5, 5] = button46; but[5, 6] = button47; but[5, 7] = button48;

    but[6, 0] = button49; but[6, 1] = button50; but[6, 2] = button51; but[6, 3] = button52; but[6, 4] = button53; but[6, 5] = button54; but[6, 6] = button55; but[6, 7] = button56;

    but[7, 0] = button57; but[7, 1] = button58; but[7, 2] = button59; but[7, 3] = button60; but[7, 4] = button61; but[7, 5] = button62; but[7, 6] = button63; but[7, 7] = button64;
}

```

```cs
//修正過後的大略樣子
private void Form1_Load(object sender, EventArgs e)
{
    int tileSize;
    for (int x = 0; x < boradSize; x++)
    {
        for (int y = 0; y < boradSize; y++)
        {
            Button tile = new Button(tileSize * x, tileSize * y, tileSize, tileSize);        
            
            tiles[x, y] = tile;
        }
    }
}
void ButtonClick() { }
```

### 沒有事件監聽

我在每次操作的時候都會掃過整張圖，來檢查黑白棋的國王是否還活著

更好的作法是在棋子上添加事件監聽，當棋子死亡後觸發事件

```cs
public abstract class BaseChess
{
    //codes...
    public Action onChessDeath;
}
```

沒提到設計模式，
除了事件監聽（觀察者模式 Oberserver Pattern）以外
以西洋棋的內容來說不太需要用到什麼模式


<!-- 
或甚至透過頭等函式與匿名方法，能夠
```cs
void ButtonForeach(int xStart, int yStart, int length, int grow, Action<Button> handler)
{
    for (int x = xStart; x < length; x += grow)
    {
        for (int y = yStart; y < length; y += grow)
        {
            handler.Invoke(buttons[j, i]);
        }
    }
}
ButtonForeach(0, 0, 8, 1, (button) => button.ForceColor = Color.White);
ButtonForeach(0, 0, 8, 1, (button) => button.Enabled = false);
ButtonForeach(0, 0, 8, 2, (button) => button.BackColor = Color.DimGray);
ButtonForeach(1, 1, 8, 2, (button) => button.BackColor = Color.DimGray);
ButtonForeach(1, 0, 8, 2, (button) => button.BackColor = Color.Gainsboro);
ButtonForeach(0, 1, 8, 2, (button) => button.BackColor = Color.Gainsboro);
```
（註：這裡的範例不太好，因為情況沒複雜到需要這樣做，有點多此一舉，我只是要展示有這種作法而已）
（再註：這部份有點跳級，如果你還沒學到頭等函式或事件監聽的可以忽略） 
-->


### 沒有資料驅動 -

資料驅動，或者說數據驅動

而在這個腳本中，我顯然沒達到這點。每種棋子的行為都我直接寫死在程式中。

```cs
//原始腳本第 118 至 535 行
private void button1_Click_1(object sender, EventArgs e)
{
    //...
    if (but[b, c].Text == chess[0]) { }
    else if (but[b, c].Text == chess[1]) { }
    else if (but[b, c].Text == chess[2]) { }
    else if (but[b, c].Text == chess[3]) { }
    else if (but[b, c].Text == chess[4]) { }
    else if (but[b, c].Text == chess[5]) { }
    //...
}
```

將行為使用硬編碼寫死的優點只有前期開發快速，隨之而來的便是幾乎鎖死的擴展性和設計彈性。

還有分工的考量在

設計人員不見得會編寫程式，如果每次遊戲設計師想增減或修改棋子，都必須

會嚴重拖累

不需要動到程式碼

數據驅動是相當重要的，棋子的行為具有高相似度

每種棋子的行為都遵循著西洋棋盤的移動規則，

我們只需要將規則寫進程式

而行為則可以透過更簡單的方式定義

```json
chessData_king.json
{
    name: "king",
    image: "chessGame/chessImages/kingImage.jpg",
    movement: ["up", "upRight", "right", "downRight", "down", "downLeft", "left", "upLeft"]
}
```

並解析

```cs
class Chess
{
    string name;
    Image image;
    Movement[] movements;

    public Chess(string sourcesData)
    {
        name = AnalyzeName(sourcesData);
        image = AnalyzeImage(sourcesData);
        movements = AnalyzeMovement(sourcesData);
    }
}

```

棋子
也不需要繁複的繼承和複寫
現在棋子物件就只是一種通用容器，根據輸入的資訊不同它就會變不同的棋子

資料驅動能提供相當大的設計彈性，只
更進一步甚至能夠允許玩家製作模組，只需要將編輯權限開放給玩家即可，


如果你想搞資料驅動的話，建議從 Lua 開始。
許多允許模組創作的遊戲便是能編寫 lua 腳本的

除非你想搞到很底層的東西，或是想再遊戲中直接提供編輯器，才有需要自己搞

可擴展性
與設計彈性

關鍵字：Data Driven Programming、Lua

{{< text/greenLine >}}
Data Driven Programming 有時也會查到 Data Oriented Design，但兩者是無關的。
{{</ text/greenLine >}}


## 其他建議和


### 減少註解 -

這部份的觀點可能因人而異，不過我個人是反對做註解的。



第一可以訓練可讀性
當失去的註解這個手段，你唯一能依靠的就是


除非你是寫 Editor Tool，或是你們程式分工有什麼對外接口讓其他程式調用，那種地方註解就是有必要的

我一直以來都是用這種方法訓練可讀性和程式架構的
剛開始可能很痛苦，睡一覺起來就看不懂昨天寫的程式了

不過長時間訓練下來的話
除了
而且你在讀別人的程式碼也能更快了解架構

因此我自己寫程式時，會做註解的狀況只有幾項
+ 分隔區塊
    最主要需要註解的情況，一個腳本裡面有不同類型的 function 要進行分隔
    ```cs
    //Initial
    void Initialize() { }
    void InitBorad() { }
    void InitChess() { }
    void InitPlayer() { }

    //Update
    void Update() { }
    void UpdateBorad() { }
    void UpdateUI() { }
    ```

+ 待做清單

    透過編輯器的搜索功能能夠快速定位，通常是 ctrl + f
    ```cs
    void SomeMethod()
    {
        //TODO some thing to do
    }
    ```

+ 真的需要註解
    比較少發生的情況
    ```cs
    /// <summary>
    ///
    /// </summary>
    void SomeMethod()
    {

    }

-

### 不要害怕重構

也可能我比較異類拉

我對重構程式蠻樂在其中的

感覺就像把樂高拆掉重拼那樣

### 無意義的簡短

簡化和減短是不同的東西

### 無意義的優化


## 結語



