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
    通常我們會稱呼編寫程式碼的那個文字文件為 Script，文中 -->


## 由簡入深

讓我們開始吧～

### 難辨識的命名 -

但是，請看以下的程式碼，這些是腳本最一開始宣告的各種變數，用於紀錄西洋棋遊戲的各種狀態。

```C#
//原始腳本 19～27 行
Button[,] but = new Button[8, 8];
string[] chess = new string[6];

string start;           //移動(不要刪錯!!!!!!!!!!!!)
int a;                  //次數
int b, c;
int d, f;
bool pass = false;        //輪流
bool white = false;          //白棋國王
bool black = false;         //黑棋國王
```

這個腳本裡的第一個問題便是命名，
首先是一開始的按鈕陣列，由於需要介面與玩家進行互動，我透過按鈕排列出棋盤的樣子，並在程式中宣告了一個二維的 Button 陣列去對應每個格子。
陣列的名稱叫做 but，概念是 button 的縮寫，



但意義上不夠精確，如果這些
當作棋盤格
`tiles, grid`


可以看到我使用了 a, b, c, d, f 來命名，而現在我重看程式完全不知道他們的用途是什麼。至於後面幾個 bool 變數，雖然我能透過註解回想起用途，但還是相當不直觀。

```C#
//更好的命名，中間 abcd 那些我自己也看不懂用途，就先刪了
Button[,] tiles = new Button[8, 8];
string[] chesses = new string[6];

bool currentTurn = false;    
bool whiteKingSurvive = false;       
bool blackKingSurvive = false;       
```
所有的命名都必須要有意義，因為這是最直接影響程式可讀性的因素，不要用 int a, b, c 這種不具有意義的名稱，或是難以理解用途的名稱，例如那個 start 變數，從註解就能看出我很常誤刪他。

尤其是剛入門的新手可能都從做題開始，雖然不會用到很複雜的名稱，甚至有些範例裡也是使用這種命名，但還是建議盡早訓練命名能力。

臨時的就叫 ```temporary, temp```

記數的就叫 ```number, amount, count```

貓狗車就叫 ```dog, cat, car```

當然迴圈變數也是根據用途命名的，i 是 index 的簡寫，如果你要遍歷陣列 ```arrayElement[i]``` 就很適合。
但如果你不是直線遍歷，像 2 維以上的陣列，迴圈有多層，就用座標軸當名稱會更適合，如 x, y。

```C# 
for (int x = 0; x < length; x++)
{
    for (int y = 0; y < length; y++)
    {
        // arrayElement[x,y] do some thing
    }
}
```

| 所有的命名都必須要有意義

如果你不知道怎麼判斷名稱命的好不好，就根據自己能不能「一眼看出變數用途」當作基準，如果不行，或理解出的意思有偏差，就代表需要 Rename。不用擔心名稱過長，可以透過駝峰命名法來提高辨識度。

訓練出命名能力後，不只你的程式可讀性會更高，你在看到其他新函式的時候透過名稱推估出大略功能，因為你知道那些命名都是有意義的。不同語言使用的規則可能略有差異，更多資料可以透過命名規則或是 Coding Style 找到。

關鍵字：Coding Styles, Naming Rules, Camel-Case

### 硬編碼的數值 -

編寫腳本時，有時在建立陣列或迴圈等地方會需要提供某些數值，
將相同意義的數值提取出來，透過變數指定

```C#
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



```C#
//將數值題取出
int boradSize = 8;
int chessesType = 6;

Button[,] tiles = new Button[boradSize, boradSize];
string[] chesses = new string[chessTypes];

for (int x = 0; x < boradSize; x++)
{
    for (int y = 0; y < boradSize; y++)
    {
        // tile[x, y] do some thing
    }
}
```


<!-- hardcode -->

### （待命名） -

前半段使用了大樣的迴圈

有時可能需要一點數學

```C#
//原始腳本第 74 101 行
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

因為我想做出黑白相間的棋盤格

```C#
//修正後的程式碼
for (int x = 0; x < boradSize; x++)
{
    for (int y = 0; y < boradSize; y++)
    {
        int tileIndex = x + y * boradSize;
        bool oddTile = tileIndex % 2;
        tile[x, y].BackColor = oddTile ? Color.DimGray : Color.Gainsboro;
    }
}


```


### 未整理的架構 +

```C#
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

從圖中可以看到所有程式都直接寫在按鈕事件中，雖然程式運行起來是有效的，但會導致整體難以維護。
除了運作流程難以辨識，如果出現某個 bug 的話，你也會更難定位到出錯的位置，也需要花更多時間理解程式的前後關係。

上面圖片中的程式大致可以拆成三個部份，重置棋盤、檢測按鈕狀態與清除狀態，可以透過 function 將它們打包為三個部份。

```C#
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

光是整理到這種程度，可讀性就顯著提高了，你也能輕鬆的理解運作流程。
而且當棋盤的清除工作出錯時，我就知道問題可能出在 ClearBorad() 當中，而不需要從整片 code 裡尋找錯誤。

如果想再更進一步，還可以將細分的 function 再拆的更細。
初始化部份的迴圈大致可以拆成三個部份，也將他們各自打包成 function。

```C#
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

如此一來，當初始化的過程出錯時（如顏色錯誤），你也能快的定位到具體位置。
而且你也會更容易注意到多餘的內容，像是 ResetColor() 和 RepaintBorad() 的本質都是繪製，可以合併進 RepaintBorad() 裡面。

透過 function 將完整工作拆成多個小塊，能顯著提昇可讀性與可維護性。


### 高重複性內容 +

<!-- funcion -->
從上面的部份你們應該看的出來，我是透過按鈕來代表棋盤格的，當按鈕按下時就會根據上面的棋子做對應工作。
不過當時我連 function 觀念都還沒有，只知道 Form1_Load 會在一開始執行，點兩下按鈕會產生 button_Click，裡面寫的東西會在按鈕按下時觸發。

在 hard code 一大堆判斷和迴圈之後，為了讓其他按鈕也有效果，我把程式碼複製貼上到所有按鈕的 Click 函式裡，光是這點就造成了腳本有九成內容都是無意義重複。
更好的作法是把重複的內容打包成 function 讓其他人調用，能夠直接有效的降低重複性。

```C#
void ButtonClick() { //codes... }
button1_Click_() { ButtonClick(); }
button2_Click_() { ButtonClick(); }

再來，透過 function 的輸入與輸出特性，也能減少不重複但高度相似的程式碼，
```

或甚至透過頭等函式與匿名方法，能夠
```C#
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


關鍵字 function
以上兩種與 function 有關的觀念，我選擇把架構放在降低重複前面



### 多餘手動作業 -

寫程式很大的目的就是要降低重複作業

這裡的場景指的是棋盤，我那時用的是 button 當作棋盤的格子

但我沒有用程式生成這些按鈕，而是在編輯界面一個個排好之後，

硬編碼手動指定網格對定的按鈕

```C#
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

```C#
//修正過後的大略樣子
private void Form1_Load(object sender, EventArgs e)
{
    int tileSize;
    for (int x = 0; x < boradSize; x++)
    {
        for (int y = 0; y < boradSize; y++)
        {
            Button tile = new Button(tileSize * x, tileSize * y, tileSize, tileSize);        
            tile.onClick = ButtonClick;
            //註：這是事件監聽的註冊寫法，當按鈕被按下時會觸發 ButtonClick 函式，如果你還不了解事件監聽可以忽略沒關係
            
            tiles[x, y] = tile;
        }
    }
}
void ButtonClick() { }
```

### 邏輯綁定視覺 -

為了保持程式的維護性，通常我們會希望將不同「程式概念」進行分離

當玩家按下一個格子按鈕時，我是透過按鈕上的「文字內容」來判斷在格子上的是什麼棋子
```C#
//原始腳本第 118 535
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

但按鈕實際上是視覺，也就是互動界面的部份
它不應該具有
界面該做的只有

為什麼要分離呢？因為我們不會修改界面上某張圖後把整個邏輯系統癱瘓掉
同理邏輯也是，我們不會希望修改邏輯時要讓整個界面都做廢

更好的作法是將按鈕映射到內部邏輯的網格
而邏輯將資訊傳到界面與玩家互動

```C#
//修正過後的大略樣子
int[,] tileGrid = new int[boradSize, boradSize];
button[,] uiButtonGrid = new button[boradSize, boradSize];

private void Form1_Load(object sender, EventArgs e)
{
    int tileSize;
    for (int x = 0; x < boradSize; x++)
    {
        for (int y = 0; y < boradSize; y++)
        {
            Button button = new Button(tileSize * x, tileSize * y, tileSize, tileSize);        
            tile.onClick = () => ButtonClick(x, y);
            //lambda Expression, 當按鈕被按下時會觸發 ButtonClick 函式，並將 x, y 作為函式輸入
            //如果你還不了解事件監聽可以忽略沒關係
            
            uiButtonGrid[x, y] = button;
        }
    }
}
void ButtonClick(x, y) 
{ 
    int clickChess = tileGrid[x, y];
    //... do some thing
}

```

如此一來，界面的按鈕就和

更細的拆分可能會將視覺、邏輯、數據分開

不過文章這裡就點到為止


### 沒有物件導向 -
棋子、棋盤、玩家都是物件

透過物件導向可以讓架構更加乾淨

將 x, y 打包成一個 vector 的 struct

```C#
public struct Vector
{
    int x, y;
    public Vector operator +(Vector a, Vector b)
    {
        return new Vector(a.x - b.x, a.y - b.y);
    }
}
```

透過繼承方法
```C#
public abstract class BaseChess
{
    Vector position;
    public abstract bool ChessMovement(Vector newPosition);
}
public abstract class KingChess
{
    public override bool ChessMovement(Vector newPosition)
    {
        Vector
        //return is movement vaild
    }
}
```

```C#
public class ChessBoard
{
    Vector boardSize;
    BaseChess[,] chessGrid;
}

```

關鍵字：Object Oriented Programming


### 沒有事件監聽

我在每次操作的時候都會掃過整張圖，來檢查黑白棋的國王是否還活著

更好的作法是在棋子上添加事件監聽，當棋子死亡後觸發事件

```C#
public abstract class BaseChess
{
    //codes...
    public Action onChessDeath;
}
```

沒提到設計模式，
除了事件監聽（觀察者模式 Oberserver Pattern）以外
以西洋棋的內容來說不太需要用到什麼模式

### 沒有資料驅動 -

所有棋子的行為都是透過硬編碼寫死的
```C#
//原始腳本第 118 至 162 行
//我透過開關按鈕來限制能走的位置
if (but[b, c].Text == chess[0]) //按國王  白 
{
    if (b < 7) { }
    if (b > 0) { } 
    if (c < 7) { }
    if (c > 0) { }

    for (int i = 0; i < 8; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            if (but[i, j].ForeColor == Color.White && but[i, j].Text != "")
            {
                but[i, j].Enabled = false;
            }
        }
    }
}
```
硬編碼行為的主要好處只有前期開發快速而已

但雖之而來的便是幾乎鎖死的擴展性和設計彈性

數據驅動是相當重要的，棋子的行為

```json
chessData_king.json
{
    name: "king",
    movement: ["up", "upRight", "right", "downRight", "down", "downLeft", "left", "upLeft"]
}
```

或是有學 Lua 的話也能用它來寫
更進一步甚至能夠允許玩家製作模組，只需要將編輯權限開放給玩家即可，許多允許模組創作的遊戲便是能編寫 lua 腳本的

如果你想搞資料驅動的話，建議從 Lua 開始。
除非你想搞到很底層的東西，或是想再遊戲中直接提供編輯器，才有需要自己搞

關鍵字：Data Driven Programming、Lua
註：Data Driven Programming 有時也會查到 Data Oriented Design，但兩者是無關的。


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
    ```C#
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
    ```C#
    void SomeMethod()
    {
        //TODO some thing to do
    }
    ```

+ 真的需要註解
    比較少發生的情況
    ```C#
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





