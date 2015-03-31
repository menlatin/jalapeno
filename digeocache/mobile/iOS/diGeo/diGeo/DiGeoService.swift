//
//  DiGeoService.swift
//  OrderedDictionary
//
//  Created by Elliott Richerson on 3/6/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import Foundation

class DiGeoService {
    
    enum  FeedResult {
        case Results([Feed])
        case Error
    }
    
    enum StatsResult {
        case Results(Stats)
        case Error
    }
    
    typealias FeedCompletion = (result: FeedResult) -> Void
    typealias StatsCompletion = (result: StatsResult) -> Void
    
    class func feed(user: String, globalFilter: Bool, friendsFilter: Bool, meFilter: Bool, completion: FeedCompletion) {
        let encodedUser = (user as NSString).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)!
        let encodedGlobalFilter: String = globalFilter ? "true" : "false"
        let encodedFriendsFilter: String = friendsFilter ? "true" : "false"
        let encodedMeFilter: String = meFilter ? "true" : "false"
        
        let feedURLString = "https://api.digeocache.com/services/rest/?method=feed&user=\(encodedUser)&globalFilter=\(encodedGlobalFilter)&friendsFilter=\(encodedFriendsFilter)&meFilter=\(encodedMeFilter)&format=json"
        
        // API Call
        //        let request = NSURLRequest(URL: NSURL(string: feedURLString)!)
        // Local Dummy Data
        let request = NSURLRequest(URL: NSBundle.mainBundle().URLForResource("Feed", withExtension: "json")!)
        
        NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (response: NSURLResponse!, data: NSData!, error: NSError!) in
            if error != nil {
                println("DiGeoCache API error: \(error)")
                completion(result: .Error)
                return
            }
            
            let results: AnyObject! = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.AllowFragments, error: nil)
            if results == nil {
                completion(result: .Error)
                return
            }
            
            if let json = JSONValue.fromObject(results) {
                
                let status = json["status"]?.string
                let feed = json["feed"]?.array
                if status != nil && status! == "success" && feed != nil {
                    var diGeoFeed: [Feed] = []
                    for feedItem in feed! {
                        diGeoFeed.append(Feed.createFromJSON(feedItem))
                    }
                    completion(result: .Results(diGeoFeed))
                    return
                }
            }
            
            // If we get here, then must be error
            completion(result: .Error)
        }
    }
    
    class func stats(user: String, completion: StatsCompletion) {
        let encodedUser = (user as NSString).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)!
        
        let statsURLString = "https://api.digeocache.com/services/rest/?method=stats&user=\(encodedUser)&format=json"
        
        // API Call
//        let request = NSURLRequest(URL: NSURL(string: statsURLString)!)
        // Local Dummy Data
        let request = NSURLRequest(URL: NSBundle.mainBundle().URLForResource("Stats", withExtension: "json")!)
        
        NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (response: NSURLResponse!, data: NSData!, error: NSError!) in
            if error != nil {
                println("DiGeoCache API error: \(error)")
                completion(result: .Error)
                return
            }
            
            let results: AnyObject! = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.AllowFragments, error: nil)
            if results == nil {
                completion(result: .Error)
                return
            }
            
            if let json = JSONValue.fromObject(results) {

                let status = json["status"]?.string
                let stats = json["stats"]?
                if status != nil && status! == "success" && stats != nil {
                    var diGeoStats: Stats = Stats.createFromJSON(stats!)
                    completion(result: .Results(diGeoStats))
                    return
                }
            }
            
            // If we get here, then must be error
            completion(result: .Error)
        }
    }

    class Feed {
        var dropID: Int = Int()
        var collected: Bool = Bool()
        var user: String = String()
        var userID: Int = Int()
        var coinAmount: Double = Double()
        var coinCurrency: String = String()
        var location: String = String()
        var coordinate: String = String()
        var timestamp: String = String()
        var assetCount: Int = Int()
        var isFriend: Bool = Bool()
        
        class func createFromJSON(json: JSONValue) -> Feed {
            var feed = Feed()
            if let dropID = json["dropID"]?.integer {
                feed.dropID = dropID
            }
            if let collected = json["collected"]?.bool {
                feed.collected = collected
            }
            if let user = json["user"]?.string {
                feed.user = user
            }
            if let userID = json["userID"]?.integer {
                feed.userID = userID
            }
            if let coinAmount = json["coinAmount"]?.double {
                feed.coinAmount = coinAmount
            }
            if let coinCurrency = json["coinCurrency"]?.string {
                feed.coinCurrency = coinCurrency
            }
            if let location = json["location"]?.string {
                feed.location = location
            }
            if let coordinate = json["coordinate"]?.string {
                feed.coordinate = coordinate
            }
            if let timestamp = json["timestamp"]?.string {
                feed.timestamp = timestamp
            }
            if let assetCount = json["assetCount"]?.integer {
                feed.assetCount = assetCount
            }
            if let isFriend = json["isFriend"]?.bool {
                feed.isFriend = isFriend
            }
            return feed
        }
    }
    
    class Stats {
        var score: Int = Int()
        var overallRank: Int = Int()
        var friendsRank: Int = Int()
        var cacheRatio: Double = Double()
        var walletValue: Double = Double()
        var videoCredits: Int = Int()
        var freezeCredits: Int = Int()
        var easyDropCredits: Int = Int()
        var bonusCredits: Int = Int()
        var transactionCount: Int = Int()
        
        class func createFromJSON(json: JSONValue) -> Stats {
            var stats = Stats()
            if let score = json["score"]?.integer {
                stats.score = score
            }
            if let overallRank = json["overallRank"]?.integer {
                stats.overallRank = overallRank
            }
            if let friendsRank = json["friendsRank"]?.integer {
                stats.friendsRank = friendsRank
            }
            if let cacheRatio = json["cacheRatio"]?.double {
                stats.cacheRatio = cacheRatio
            }
            if let walletValue = json["walletValue"]?.double {
                stats.walletValue = walletValue
            }
            if let videoCredits = json["videoCredits"]?.integer {
                stats.videoCredits = videoCredits
            }
            if let freezeCredits = json["freezeCredits"]?.integer {
                stats.freezeCredits = freezeCredits
            }
            if let easyDropCredits = json["easyDropCredits"]?.integer {
                stats.easyDropCredits = easyDropCredits
            }
            if let bonusCredits = json["bonusCredits"]?.integer {
                stats.bonusCredits = bonusCredits
            }
            if let transactionCount = json["transactionCount"]?.integer {
                stats.transactionCount = transactionCount
            }
            return stats
        }
        
    }
}