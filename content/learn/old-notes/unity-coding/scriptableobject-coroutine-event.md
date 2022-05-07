---
title: "Scriptableobject Coroutine Event"
date: 2020-06-02
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Scriptable Object 2.5 -Coroutine, event

Scriptable Object
模組化的進階運用，模組化行為架構，搭配Coroutine及event

接續筆記 Scriptable Object 2 -Coroutine
(參考 event系列筆記

------------------------------------------------------------------------------

運用 Coroutine, C# event
在移動行為中觸發委派、在移動完畢後觸發委派


用於 EnemyData 實例化的物件、調用行為、傳入事件，以及物件池回收
public class EnemyObject : MonoBehaviour
{

    EnemyData enableData;
    public Action<EnemyObject> EnemyRecycleHandler; //物件池委派

    void ResetObject() { //實例化，參數，視覺  }
    void EnemyActive()
    {
        StartCoroutine(enableData.Movement(this, EnemyRecycleHandler));
        在移動完成時觸發物件池回收委派
    }
}
調用 EnemyData 的移動行為 Routine，並傳入 EnemyObject自身，及移動行為完成時執行的委派
(參考筆記 事件運用 建構、解構 & 一些細節


模組化架構的核心，行為架構將被組裝在這上面
public class EnemyData : ScriptableObject  
{
    //other variable...

    [Header("EnemyBehaviours")]
    [SerializeField] BaseEnemyMovement enemyMovement = null;
    [SerializeField] BaseEnemyAction movementAction = null;

    public IEnumerator Movement
        (EnemyObject movementObject, Action<EnemyObject> FinishHandler)
    {
        return enemyMovement.Movement
             (movementObject, movementAction.TriggerAction, FinishHandler);
    }
}
在Inspector變量 BaseEnemyMovement 中，組裝上不同的行為
(BaseEnemyMovement, BaseEnemyAction
回傳移動行為 Routine，再交給 EnemyObject傳入事件並調用


模組化的基本行為
public class BaseEnemyAction : ScriptableObject
{
    public virtual void TriggerAction(EnemyObject triggerEnemy){  }
}
//複寫範例省略


讓 Coroutine傳入 EnemyObject及 Function(Aciton)，並做出移動行為和事件的觸發
public class BaseEnemyMovement : ScriptableObject
{
    public virtual IEnumerator Movement
            (EnemyObject movementObject, Action<EnemyObject>          
             MovementActionHandler,Action<EnemyObject> MovementFinishHandler) { }
}
覆寫移動行為，繼承自 BaseEnemyMovement，添加上移動模式以及委派的觸發
public class UpwardMovement : BaseEnemyMovement
{
    //other variable...

    public override IEnumerator Movement
            (EnemyObject movementObject, Action<EnemyObject>       
              MovementActionHandler,Action<EnemyObject> MovementFinishHandler)
    {
        while (time < duration)
        {
            //upwardMovement...
            
            //if trigger movement Action...
            MovementActionHandler?.Invoke(movementObject);

            yield return null;
        }

        MovementFinishHandler?.Invoke(movementObject);
    }
}


註，警告
ScriptableObject是直接對 Project裡的物件進行引用
如果 Action宣告在 ScriptableObject的 class中，註冊事件時不同物件都會註冊在同一個 Scriptable上
public class NewScriptableObject : ScriptableObject
{
    public Action ScriptableObjectEvent;
    public Action ScriptableObjectHandler;

    public void InvokeFunction() { //Actions Invoke }
}


這是在把專案的敵人、道具，用ScriptableObject重作了一次之後整理出的筆記
專案中差不多就是用這種方法達成模組化架構的

這種作法可能會造成可讀性上的問題
如果行為模式單一的話，還是建議只讓Scriptsable Object儲存數值就好
但如果沒個行為模式的差異都蠻大的話，用這種方式就OK

之後搭配Animation用也會再發筆記

筆記的資料夾
https://home.gamer.com.tw/creationCategory.php?owner=angus945&c=450267