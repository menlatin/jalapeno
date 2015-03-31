//
//  FeedTableViewController.swift
//  OrderedDictionary
//
//  Created by Elliott Richerson on 3/6/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import UIKit

class FeedTableViewController: UITableViewController {
    
    var feed: [DiGeoService.Feed] = Array()
    
    var globalFeed: [DiGeoService.Feed] = Array()
    var friendFeed: [DiGeoService.Feed] = Array()
    var meFeed: [DiGeoService.Feed] = Array()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        DiGeoService.feed("Elliott", globalFilter: true, friendsFilter: true, meFilter: false) {
            switch($0) {
            case .Error:
                break
            case .Results(let results):
                self.feed = results
                self.tableView.reloadData()
            }
        }
    }
    
}

/* Handle Table View Data Source + Delegate */
extension FeedTableViewController: UITableViewDataSource, UITableViewDelegate {
    
    enum FeedSection: Int {
        case Filter
        case Global
        case Friends
        case Me
    }
    
    func globalCountForFeed() -> Int {
        // TODO: Replace hard-coded username with global way of checking
        // userID or user name who is logged in
        globalFeed = feed.filter{ !$0.isFriend && $0.user != "Elliott" }
        return globalFeed.count
    }
    
    func friendCountForFeed() -> Int {
        friendFeed = feed.filter{ $0.isFriend }
        return friendFeed.count
    }
    
    func meCountForFeed() -> Int {
        // TODO: Replace hard-coded username with global way of checking
        // userID or user name who is logged in
        meFeed = feed.filter{ $0.user == "Elliott" }
        return meFeed.count
    }
    
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 4
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case FeedSection.Filter.rawValue:
            return 1
        case FeedSection.Global.rawValue:
            return self.globalCountForFeed()
        case FeedSection.Friends.rawValue:
            return self.friendCountForFeed()
        case FeedSection.Me.rawValue:
            return self.meCountForFeed()
        default:
            return 0
        }
    }
    
    override func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case FeedSection.Filter.rawValue:
            return "Filter"
        case FeedSection.Global.rawValue:
            return "Global"
        case FeedSection.Friends.rawValue:
            return "Friends"
        case FeedSection.Me.rawValue:
            return "Me"
        default:
            return ""
        }
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let CellIdentifier = "Cell"
        
        var cell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier(CellIdentifier) as? UITableViewCell
        
        //        if cell == nil {
        //            cell = SideDrawerTableViewCell(style: .Default, reuseIdentifier: CellIdentifier)
        //            cell.selectionStyle = .Blue
        //        }
        
        var feedItem: DiGeoService.Feed = DiGeoService.Feed()
        
        switch indexPath.section {
        case FeedSection.Filter.rawValue:
            switch indexPath.row {
            case 0:
                cell.textLabel?.text = "FILTER"
                break
            default:
                break
            }
            break
        case FeedSection.Global.rawValue:
            feedItem = globalFeed[indexPath.row]
            cell.textLabel?.text = feedItem.location
            break
        case FeedSection.Friends.rawValue:
            feedItem = friendFeed[indexPath.row]
            cell.textLabel?.text = feedItem.location
            break
        case FeedSection.Me.rawValue:
            feedItem = meFeed[indexPath.row]
            cell.textLabel?.text = feedItem.location
            break
        default:
            break
        }
        
        return cell
    }
    
}