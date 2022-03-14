---
title: "七萬行硬編碼寫出的西洋棋"
date: ---
lastmod: ---
draft: true
keywords: []
description: "從初學時做出的作品，反思學習路徑"
tags: ["程式"]
category: ""
author: "angus chan"
featured_image: ""
listable: true
important: 10

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: false
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


## 前言 +

自學遊戲開發以來...

和人聊天的時候突然想到

某個初學程式時做的...

<!-- 個人最開始接觸程式時，是在四年前就讀高職資訊科的時候， -->

我透過 windows from 的按鈕元素表示棋盤格，並利用中文字與按鈕的顏色來表示棋子和棋子所屬的陣營。遊戲內容沒什麼特別的，一個常規的古典西洋棋，需要在本機由兩個人輪流控制來對弈，沒有 AI 也沒有連線對戰的功能。

{{< pathImage "ChessGame.jpg" "80%" >}}

在我挑戰這個專案時（至少以那時的能力來說是挑戰），我的程式能力僅在變數、判斷式、迴圈的程度。別說類別和物件導向，當時我是個連「函式」概念都不懂的入門者，只是個無情的解題機器。但是刻在靈魂中的志向，使我嘗試挑戰製作出一個遊戲。於是我使用僅有的程式知識，硬是刻出了這個西洋棋遊戲，導致這個專案的唯一腳本中有長達七萬行的程式碼。

{{< pathImage "thousandLineOfcodes.jpg" "80%" >}}

雖然粗暴，不過以結果來說他也是有效的。但隨著程式能力增長，除了單純的「達成目的」以外，我也開始思考如何寫出「更好」的程式。這個專案提供了很好的切入點，從現在的角度回來看，它就像一個完美的負面教材，於是我決定透過這篇文章，點出程式中能能夠改進的部份。

### 注意事項 +

1. 在文章的程式區塊中，我會透夠註解來表示哪些是原始內容，哪些是修正過後的。而範例中的程式以是 C# 為主，但僅用於展示範例和觀念，無法真正運作。

2. 文章內容主要是針對「遊戲開發」的程式，程式的其他領域可能不完全適用，但也可以提供不同的思考方向。當然，也歡迎各位提供不同領域的思考方向。

3. 這篇文章的定位比較像是「學習路徑指南」而非教學，因此每段落的內容可能不會過於深入。但可以透過不同段落的內容大致判斷自己的能力階段，並作為更進一步學習的基準。

## 由簡入深

以下就開始進入正題

章節的排序方法是根據

個人學習經驗

與文章的連貫性

並非強制

{{< pathLink "完整腳本連結 Form1.cs" "Form1.cs" >}}

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

{{< pathImage "camelCase.png" >}}

訓練出命名能力後，不只你的程式可讀性會更高，你在看到其他新函式的時候透過名稱推估出大略功能，因為你知道那些命名都是有意義的。不同語言使用的規則可能略有差異，更多資料可以透過命名規則或是 Coding Style 找到。

<!-- https://docs.microsoft.com/zh-tw/dotnet/standard/design-guidelines/naming-guidelines -->

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

<!-- MVC -->

### 資料結構零散 +

有時我們在定義數據時，會遇到需要多的變數來表打一種資訊，而在這個腳本中的案例就是網格的座標。我使用了兩個 int 儲存點擊位置的 x 軸與 y 軸資訊。

```cs
//修正過後的程式，原始腳本第 23 行的 int b, c
int clickX, clickY; 
```

雖然這是兩個變數，但他們實際上是有直接關聯的，應該被視為一體才對。為此，我們可以透過 struct 將零碎的資訊打包，把這它們打包為一個資料結構 —「向量」。

```cs
//修正過後的程式，將兩個 int 打包為一個向量結構 
public struct Vector
{
    float x, y;
}
```

如此一來，我們就能更簡潔的表達出這是「一個」向量空間中的二維數值。

```cs
Vector BoardSize;
Vector TilePosition;
Vector ClickPosition;
Vector ChessPosition;
```

除此之外，打包成一個資料結構也允許我們更方便的定義進階行為，例如長度計算或向量之間的加減法。

```cs
//修正過後的程式，這篇不是教數學的，所以我就省略具體運算內容了
// operator 為 C# 中的運算符多載，允許透過運算符調用函式
public struct Vector
{
    float x, y;

    public Vector operator +(Vector a, Vector b) { }
    public Vector operator -(Vector a, Vector b) { }
    public Vector operator *(Vector a, float mul) { }
    public Vector operator /(Vector a, float div) { }

    public static Vector Normalize(Vector vector) { }
    public static float Distance(Vector origin, Vector destination) { }

    public static Vector Dot(Vector lhs, Vector rhs) { }
}
```

如此一來我們也能更方便的調用函式運算，而不需要每次都重複編寫算式。

```cs
//範例：計算與目的地的方向與距離
Vector direction = Vector.Normalize(target - current);
float distance = Vector.Distance(current, target);
```

透過物件導向將零碎的資料整合為一個整體，省去過多的零碎變數，讓架構更乾淨並同時提高可讀性。

傳值和傳址

### 類別內容混雜 +

　　目前為止，我們都是將所有內容寫在同個腳本，或者說類別 (class) 當中，感覺起來就像所有東西都被鑲在一起那樣。雖然這是「一個西洋棋遊戲」沒錯，但無論西洋棋、象棋或是其他遊戲，它們都是由複數的「物件」與「規則」交互作用所構成的。

物件包括棋盤、棋子與玩家，而規則限制了棋子的移動方式，玩家之間的操作以及輸贏判定。這也是現實中物體的運作原理，每個獨立的物體都有自己的行為邏輯，物體之間的行為互動構成規則，規則再與規則結合出複雜的系統。將整個腳本的內容拆分為複數物件，以現實世界的運作原理為參考，進行程式設計的方法，也就是所謂的物件導向。

首先建立一個 Chess 的棋子類別，並在其中建立棋子屬性所需的變數，包括棋子類型和其所屬整營。

```cs
//修改後的程式碼 Chess.cs
public class Chess
{
    int type;
    int faction;
    public Class(int type, int faction)
    {
        this.type = type;
        this.faction = faction;
    }
}
```

再來便是物件的「行為」，也就是棋子的移動方式。移動方式的實作方法有許多種，這邊就假設棋子會透過類型判斷移動方向是否被允許。建立一個判斷移動的函式，透過棋子的屬性「類型」和輸入的預期移動，判斷是否符合棋子行為，透過外部系統（如棋盤）調用來進行判斷。

```cs
//在 class Chess 當中
public bool ChessMovement(Vector destination)
{
    switch(chessType)
    {
        case 0:
            //return isMovement vaild;
        //case 1, case 2, case 3, ...
    }
}
```

完成了戰士之後，需要一個戰場讓他們廝殺，也就是「棋盤」。建立棋盤類別 ChessBorad，儲存棋盤需要的屬性（例如大小或放在棋盤上的棋子），透過建構函式傳入棋盤大小。

```cs
//修正後的程式 ChessBoard.cs
public class ChessBoard
{
    public Vector size;
    public Chess[,] chessBoard;
    public ChessBoard(Vector size)
    {
        this.size = size;
        chessBoard = new Chess[size.x, size.y];
    }
}
```

同樣的，棋盤物件也具有一些行為，例如放置棋子到棋盤上、選取一個棋子並移動它。

```cs
//在 class ChessBoard 當中
public void PlaceCess(Chess chess, Vector place)
{
    chessBoard[place.x, place.y] = chess;
}
public void SelectChess(Vector position) { }
public void MoveChess(Vector destination) { } 
```

上面的兩個物件「棋子」和「棋盤」是比較具體的物件，能夠輕易的透過現實的邏輯分隔開來，但在編寫程式時，有時也會遇到比較抽象但必要的存在，像是「世界」或者說是「世界的規則」。

在西洋棋當中，世界便是「西洋棋遊戲」的規則本身。讓由兩個玩家輪流行動，控制棋子的行為；檢測國王是否存活，判定這場戰爭的最終結果。建立一個類別 ChessGame，儲存回合狀態與棋盤資訊，以及（範例中假定的）其他系統。

```cs
//修正後的程式 ChessGame.cs
public class ChessGame
{
    int currentTurn;
    ChessBoard board;
    TurnManager turnManager;
    InputSystem inputSystem;

    BoardVisual visual;
}
```

現實中的西洋棋，遊戲流程的控管會交由玩家本身進行，但在程式中我們除了基本規則以外，也必須主動控管遊戲的進程，從遊戲開始的初始化、切換回合、檢測玩家輸入、檢測遊戲勝負，以及顯示遊戲結果。

```cs
//在 class ChessGame 當中，這裡假設 main 會在一開始執行
public void main()
{
    GameInitial();
    
    while(!isGameEnd)
    {
        SwitchTurn();
        PlayerInput();
        CheckWinner();
    }

    EndGame();
}
void GameInitial()
{
    board.Initial();
    turnManager.Initial();
    inputSystem.Initial();

    visual.Initial();
}
void SwitchTurn() { }
void PlayerInput() { }
bool CheckWinner() { }
void EndGame() { }
```

透過物件導向進行工作拆分，使用更有架構的方式控管各項功能，我們也能更輕鬆的區分不同程式碼間的關聯。不過這只是物件導向的最最基礎而已，除此之外還有多型、繼承、抽象、界面、泛型等進階應用，真的要深入的話好幾篇文章都說不完的，因此這裡就提供一些深入方向提供參考。

<!-- TODO 修正內容 -->
+ 物件導向 Object Oriented Programming  
    從這兩個章節開始正式踏入物件導向的領域，能夠幫助你建構更加複雜的世界。物件導向是較為主流的程式設計方法，因此隨便 Google 都有一海票資料。當然進階的程式架構方法也不只有物件導向，但它之所以能成為最被廣泛使用的程式設計方法就是因為與現實邏輯的相近性（望向隔壁的資料導向）。

+ 設計模式 Design Patterns  
    當開始踏入物件導向時，設計模式一詞也會進入你的視野。由前人的經驗整合和出的智慧，如何架構程式、降低耦合度、提升擴展性與優化效能。或許程式的編寫沒有對錯，但還是有好壞之分的，如果想將程式寫的「更好」，勢必得花時間遊覽這個知識寶庫。
    
+ 繼承和多型 Inheritance    
    繼承類別 (Inheritance) 來重用程式碼，透過多型 (Polymorphism) 特性封裝具體內容，利用抽象 (abstruct) 與虛擬 (virtual) 函式定義框架，並使用覆寫 (override) 進行具體實作。更進一步的應用可以參考設計模式「子類別沙盒」 (Subclass Sandbox)。

+ 泛型介面與條件約束 Generic  
    利用泛型類別 `Class<T>` 建立通用系統，透過介面 (interface) 定義型別內容，並使用條件約束 (where) 明確型別類型。熟悉泛型的運用能夠幫助各位開發更加通用的系統，建立出自己的程式工具箱。

### 多餘手動作業 +

無論是場景布置，還是介面編排，在開發遊戲的過程中時常會遇到需要需要執行手動作業的情況。雖然這些作業大多都不會花太多時間，但頻繁的瑣碎操作還是可能在整個開發流程中累積不小開銷。在這專案中指的便是與玩家互動的介面 -- 棋盤，我透過將 Button 元素編排成網格狀來達到棋盤效果。

{{< pathImage "buttonElement.jpg" "100%" "Windows from 官方文檔參考圖" >}}

我從 Toolbox 拉出一個按鈕元素，調整高度和寬度，複製並排出按鈕網格，最後在硬編碼一個個將邏輯網格與按鈕網格連接上。從下面的程式碼就能看出這項作業有多繁瑣且無意義。

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

西洋棋盤的網格配置是固定的，只需要因此只需要根據想要的大小與間距就能輕易的計算出元素位置，並生成出元素並自動放置，能省去手動排版的作工。

```cs
//修正過後的「大略」樣子
//這裡的 UIButton 是假想的介面元素，如何生成元素並與邏輯連結，請根據使用語言與工具的差異進行修正
class ChessBoardVisual
{
    UIButton[,] boardButtons;

    void CreateVisualElements(Vector size, Vector thickness)
    {
        for (int x = 0; x < boradSize.x; x++)
        {
            for (int y = 0; y < boradSize.y; y++)
            {
                Vector position = new Vector(x * size.x, y * size.y); 
                Vector offset = new Vector(x * thickness.x, y * thickness.y);

                boardButtons[x, y] = new UIButton(position + offset, size);
            }
        }        
    }
}
```

<!-- 修正生成的概念 -->

當然，有些情況會需要我們進行手動操作，但若只是單純的重複作業就放心交給程式吧，如此以來我們也能將時間用在更重要的事情上，例如改善使用者體驗 (User Experience, UX)。文章中的棋盤格算比較簡單的情況，UI 製作中的列表與網格的編排是最常使用到的，透過程式自動計算元素位置也是常用的作法，Unity 引擎也有內建的組件供開發者使用 (UI Layout Group)。

+ 開發自己的「開發工具」  
    減少手動作業這項核心思想也不局限於介面。無論資料編輯還是場景布置，開發輔助工具或許對於遊戲機制沒太大幫助，但能使我們在開發過程中更加輕鬆。以Unity 引擎來說，他的 Custon Editor 也提供了很自由的擴展性。

### 程式雙向耦合 +

當回合結束時，整個遊戲中有許多不同系統需要做它該做的事。

1. 棋盤需要將當前的棋子分佈保存，確保遊戲被中斷後能夠正常恢復狀態。
2. 改變 UI 的提示，告知玩家回合發生變換，接下來要由誰操作。
3. 改變使用者能選取的棋子，假設接下來是黑棋的回合，那便要把白棋鎖住，並解鎖黑其選取。
4. 讓音效播放器發出有趣的回合切換提示音。

假設我們有個「回合系統」的類別，它負責管理遊戲中玩家雙方的回合狀態。在原本的作法中，我們可能會讓回合系統在切換回合的同時，呼叫上述的系統執行任務。

```cs
class TurnManager
{
    //玩家只有兩位，因此這裡透過 bool 變數儲存回合狀態
    bool currentTurn;

    ChessBoard chessBorad;
    UIManager uiManager;
    ChessSelector chessSelector;
    SoundEffectPlayer soundEffectPlayer;
    
    public void ChangeTurn()
    {
        currentTurn = !currentTurn;

        chessBorad.SaveState();
        uiManager.ChangeUI(currentTurn)
        chessSelector.ChangeTargets(currentTurn)
        soundEffectPlayer.TurnChangeSound();
    }
}
```

雖然這樣能有效達成目的，但也帶來了幾項問題，除了用來切換回合的函式內出現了多餘的工作，回合系統也需要另外的變數來儲存這些系統的引用。回合系統與許多系統發生雙向耦合，首先是需要由回合系統調用的概念耦合，以及回合系統調用函式的直接耦合，因此每當每當我們想增減某項工作時，都會影響到雙方系統，導致程式難以維護。

<!-- 而且函式必須要為 public -->
<!-- TODO 示意圖 -->
<!-- TODO 描述修正 -->

要解決這個問題，我們可以透過「事件監聽」的方法來將耦合變為單向，不讓系統直接調用函式，而是用某種手段「儲存」那些想被調用的函式，如此一來就能避免直接編寫調用來的彈性。如果你是用的是頭等函式語言（如 C#），可以直接透過 System.Action 或是 delegate 建立函式變數，來達成事件註冊的功能。如果是允許指標操作的語言（如 C++）則可以利用函式指標的陣列來達成目的，將要註冊函式的指標傳入陣列，事件觸發時一個個調用即可。
<!-- TODO 描述修正 -->
（註：我沒有真的寫過 C++，如果有描述有誤麻煩各位指正）

文章這裡就以 C# 的 System.Action 變數來達成效果，讓回合系統提供一個會在回合切換時觸發的事件，並由其他系統在初始化時進行註冊。

```cs
class TurnManager
{
    bool currentTurn;
    public Action<bool> OnTurnChangeEvent;
    
    public void ChangeTurn()
    {
        currentTurn = !currentTurn;

        OnTurnChangeEvent?.Invoke(currentTurn);
    }
}
```

```cs
class ChessBorad
{
    void Init()
    {
        OnTurnChangeEvent += SaveState;
    }
    void SaveState() { }
}
```

這樣修改與原本的差別在哪呢？第一便是程式連接變為單向，其他系統對回合系統的概念連接，以及註冊函式的時的直接連接。回合系統現在不需要顧慮其他系統，它只要在該觸發事件的時候觸發即可。

當我們想增減某項工作時，也不需要接觸到回合系統的程式碼，只要自己在初始化時進行註冊即可。訊息發出者並不在乎有誰聽到，它該做也唯一會做的就是發出通知，讓聽到通知的人自己去做該做的事，透過這種方法能有效避免程式耦合。

掌握這項技巧，對程式的架構能力會更上一層，文章同樣也點到為止，這裡提供進一步的資料提供深入。

+ 觀察者模式 Observer Pattern  
    事件監聽的應用

<!-- 我在每次操作的時候都會掃過整張圖，來檢查黑白棋的國王是否還活著

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
以西洋棋的內容來說不太需要用到什麼模式 -->

### 沒有資料驅動 +
<!-- TODO Rename -->

資料驅動，或者說數據驅動，也是一種廣泛使用在遊戲開發中的進階程式設計方法，其核心思想在於「將數據賦予意義」，讓簡單的數據片段代表某種「命令」，並透過這些片段組合出複雜的「行為」。

為什麼要使用資料驅動？在開發遊戲時，我們不能夠指望所有行為設計師（或企劃）都擁有完整的程式設計能力，若每次改動設計時都需要由工程師修改專案的原始碼，並且重新編譯、建構執行檔後再讓測試人員進行測試，團隊的工作週期都被繁瑣的修改作業佔據。如果遊戲是基於資料驅動原則建構而成的，那設計師只要尋找行為定義文件，打開並修改某些字串或數值，就能將某支怪物設計的更具攻擊性，或是刪減過於強大的裝備效果，一切都都在設計師的掌控之下，工程師也不必為了零碎的修改煩心。

除此之外，即是不是為了分工考量，資料驅動本身帶來的開發效益也相當可觀，除了提供開發者龐大的設計擴展性，也能允許玩家以更低的門檻進行「模組開發」。

而在這個專案中，我將所有行為都直接使用程式寫死，顯然不符合資料驅動的原則，文章這裡示範幾種將遊戲修改為資料驅動的簡單方法。首先便是棋子的資料結構，透過 json 這種輕量文字文件的儲存所需資料即可，包括棋子的編號、名稱、圖像以及移動方法。

```json
chessData_king.json
{
    id: 0,
    name: "king",
    image: "chessGame/chessImages/kingImage.jpg",
    movements: ["up", "upRight", "right", "downRight", "down", "downLeft", "left", "upLeft"]
}
```

接著只要編寫將文件導入專案，提取出裡面的文字資料進行解析，並包裝成遊戲程式需要使用的格式即可，也就是棋子物件。

```cs
class Chess
{
    int id;
    string name;
    string image;
    string[] movements;

    public Chess(string sourcesData)
    {
        id = AnalyzeID(sourcesData);
        name = AnalyzeName(sourcesData);
        image = AnalyzeImage(sourcesData);
        movements = AnalyzeMovement(sourcesData);
    }
}
```

json 的轉換有許多資料能夠查詢了，文章這裡就先省略，只著重在如何將片段的命令對應到實際程式上：`movements: ["up", ...]`。命令與程式的對應方法大致上有兩種 - 直譯和編譯，沒錯就是你們想的那個直譯和編譯。

直譯的話，可以直接透過透過判斷式在運行時將命令進行比對，並對應到實際程式上，編寫出的節過大致如下：

```cs
public bool MovementInterpreter(Vector destination, string[] movements)
{
    for(int i = 0; i < movements.length; i++)
    {
        switch(movement)
        {
            case "up":
                if(CheckMoveUp(destination)) return true;

            case "down":
                if(CheckMoveDown(destination)) return true;

            //case right, case left, ...
        }
    }

    return false;
}

bool CheckMoveUp(Vector destination) { }
bool CheckMoveDown(Vector destination) { }
//other movement check
```

編譯則是在某個適當時機（通常是初始化時），將原本的命令轉換為更具效能優勢資料結構，省去解析資料時本身的開銷。要達成編譯效果有兩種作法，第一就是如同真正的電腦一樣，定義一種接近機器語言的低階語言（位元組碼），並在遊戲系統中製作一台虛擬機器運行它。但我更傾向利用頭等函數語言的特性，將整個命令打包為能直接使用的「函式變數」儲存，在開發上會輕鬆許多。

```cs
delegate bool MovementHandler(Vector destination);
public MovementHandler[] CompileToHandler(Vector destination, string[] movements)
{
    List<MovementHandler> handlers = new List<MovementHandler>();
    for(int i = 0; i < movements.length; i++)
    {
        switch(movement)
        {
            case "up":
                handlers.Add(CheckMoveUp);
                break;

            case "down":
                handlers.Add(CheckMoveDown);
                break;

            //case right, case left, ...
        }
    }

    return handlers.ToArray();
}
bool CheckMoveUp(Vector destination) { }
bool CheckMoveDown(Vector destination) { }
```

資料驅動也有千千百百種作法，輕能允許開發者更方便的修改各項參數與公式，重則能允許對道具效果、人物行為甚至是整個遊戲機規則進行修改。同樣的，文章也只作為學習的方向指點，這裡提供一些補充資料，更進一步的內容請自行研究。


+ **資料結構數據化**  
    透過類型物件模式 (Type Object Pattern)，改變建構與儲存遊戲資訊的方法，透過更輕量的資料結構提昇修改便利性。並利用原型模式 (Prototype Pattern) 重用數據，減低不必要的修改作業。 

+ **定義與解析資料**  
    可以參考編譯器中的語法解析原理 (Lexical analysis)。正規表達式 (Regular expression) 是個可靠的幫手，強大的字串辨識算法能省去許多繁瑣作業。令牌化 (Tokenization) 能龐大的文字資訊拆分為易於解析的片段。

+ **單一命令建構行為**  
    賦予簡單的資訊片段對應的命令，堆疊操作、數值計算、法術施放！將創造一種新的語言，讓我們能透過簡單的命令建構起複雜的行為，提供極為強大的編輯彈性，參考位元組碼模式 (Bytecode Pattern)。

除此之外，有一種語言叫做 Lua，是常被用於遊戲數據、公式與邏輯定義的輕量級腳本語言，也是一種接觸資料導向的好方向（雖然我自己也還沒學 :P）


<!-- DLL, XML -->


## 個人建議 +

上面部份是根據我自學過程分析出的一些重要節點，而這個章節就只是一些由個人經驗產生的想法而已，並不一定適用於其他人。但還是分享給各位，希望能提供不同的視角。

### 盡量減少註解 -

有些人可能說要盡量多寫註解，看看程式碼時才會比較輕鬆，也能避免一覺起來就發現昨天的程式都看不懂了。但是對於這點，我個人是持反對意見的，我認為以長期的「學習」來說，盡可能避免註解會更好，原因如下。

<u> **降低對註解的依賴，能提高對命名的重視度** </u>

在【難辨識的命名】章節中有提到，糟糕的命名會讓人難以辨認變數的含意，雖然能夠過註解來解釋變數的用途，但為什麼要多做這一步呢？

```cs
int a;
int b;
// a = how much dog
// b = how much cat
```

能夠訓練命名能力

<u> **避免註解解釋，能提高對程式架構的敏感度** </u>
<!-- Rename -->

當你「只能」透過命名來表達函數、類別的內容時，你也會發現一些程式功能無法被命名涵蓋。雖然透過註解就能簡單的補充，但這段「不該存在此處」的程式碼也將被保留下來。

倘若現在失去了註解的手段，處裡這些內容的最好辦法就是進行程式碼「拆分」，將多餘的內容拆分至不同函式或腳本當中，並用適合他的命名來描述內容。這個過程也能訓練自己對程式架構的敏感度與重構能力。

現在我在寫程式時，會做註解的狀況只有幾種而已。

+ 分隔區塊  
    是我最主要會做註解的情況，一個腳本裡面有不同類型的函式要進行分隔，而註解在文字編輯器中會有不同的顏色提示，能夠方便我做視覺上的區分。
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

+ 待做事項  
    也就是所謂的 TODO，有些功能只是先建立而已，打算其他部份忙完再回來實做，為了避免忘記可以透過註解做標籤紀錄。之後只要透過搜尋文字的功能，就能快速定位回待做事項的位置上。
    ```cs
    void SomeMethod()
    {
        //TODO do something
        //透過編輯器的搜索功能搜尋 "TODO"，搜索快捷鍵通常是 ctrl + f
    }
    ```

+ 真的需要  
    真的需要註解的情況，也是比較少發生的情況。通常是在搞通用函式庫，或是程式協做有特定接口要和別人對接的情況...再不然就是真的想不到怎麼命名 :P
    ```cs
    /// <summary>
    /// 編寫函式的功能概括，會顯示在編輯器的函式提示匡中
    /// </summary>
    void SomeMethod()
    {

    }
    ```

因此個人建議
<!-- 
我從初學遊戲開發開始都有意在避免寫註寫，透過這種手段訓練自己的可讀性和程式架構能力。剛開始是真的很吃力沒錯，睡一覺起來就看不懂昨天寫的程式了，但長時間累積下來，程式架構能力真的長進不少，現在不要說一天或一個月，我有把握自己寫的程式碼一年後還看得懂。 -->

## 結語

### 補充內容

如何查詢資料

文章中已經提供大量的關鍵字了

Google: C# Inheritance

<!-- https://home.gamer.com.tw/creationDetail.php?sn=5217944 -->

http://gameprogrammingpatterns.com/

http://gpps.billy-chan.com/


### 缺失的內容

有一部分是

但很可能更多部份是

很遺憾的是在我學到東西以前，我是不知道自己缺乏什麼的

這篇文章是以我自身的學習經歷

這篇文章沒寫到的內容

### 感謝閱讀

個人網站的留言功能暫時未完成
請至巴哈小屋留言

