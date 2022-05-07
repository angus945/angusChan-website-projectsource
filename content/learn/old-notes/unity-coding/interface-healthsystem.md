---
title: "Interface Healthsystem"
date: 2020-10-06
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Interface 筆記
透過介面來製作血量系統
分享一下主專案的程式心得

結論
不要使用 interface 實作血量系統，interface 適合用在要求不多但各自實作差異比較大的東西上
血量系統這種有大量差異不大重複功能的系統，用 abstract 會更適合

建立介面
命名使用I做前綴
public interface IHealthSystem
{
    
}

變量和函式只能是抽象的
int MaxmumHealth {get; }
int CurrentHealth {get; set;}
Action OnHealthChangeEvent {get; set;}

void SetHealth(int health);
void SendDamage(int damage, DamageType type, GameObject sender);
註: 函式結尾記得要分號

實作介面
一個class可以繼承並實作多個介面
public class PlayerStatus : MonoBehaviour, IHealthSystem, IHealthStatus, IOutherInterface
{
    int currentHealth;
    public int CurrentHealth
    {
        get => currentHealth;
        set
        {
            currentHealth = Mathf.Clamp(value, 0, MaxumnHealth);
            OnHealthChangeEvent?.Invoke();
        }
    }

    public int MaxumnHealth { get; private set; }
    public Action OnHealthChangeEvent { get; set; }

    public void SetHealth(int health)
    {
        CurrentHealth = health;
    }
    public void SendDamage(int damage, DamageType type, GameObject sender)
    {
        CurrentHealth -= damage;
    }

實作其他介面...略
}


取得介面並傳遞參數
在Unity一樣使用GetComponent就行，但取得的是介面而不是實作者
IHealthSystem targetHealth = target.GetComponent<IHealthSystem>();
targetHealth.SetHealth(100);
targetHealth.SendDamage(50, DamageType.None, gameObject);

使用上的好處
讓分工更清楚，實作時沒有限制，傳遞資料時也不必知道實作者是誰

而且可以根據不同需求實作內容
例如專案中的玩家會根據裝備有傷害減免
public void SendDamage(int damage, DamageType type, GameObject sender)
{
    int takeDamage = TakeDamageOfType(damage, type);
    CurrentHealth -= takeDamage;
}

有些敵人會有反傷
public void SendDamage(int damage, DamageType type, GameObject sender)
{
    CurrentHealth -= damage;
    sender.GetComponent<IHealthSystem>().SendDamage(damage, type, gameObject);
}

不需要的功能就不必繼承
專案中還有一些特殊狀態，像是電磁和護盾
但是把狀態傳遞也寫進 IHealthSystem就會讓分工有點混雜了，所以我另外建立了一個介面 IHealthStatus，用來傳遞狀態資料
本身只需要血量系統的就只繼承 IHealthSystem，需要進一步使用狀態的再繼承 IHealthStatus