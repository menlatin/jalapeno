//
//  FeedViewController.swift
//  diGeo
//
//  Created by Elliott Richerson on 3/5/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import UIKit

enum FeedSection: Int {
    case Filter
    case Global
    case Friends
    case Me
}

class FeedViewController: ExampleViewController, UITableViewDataSource, UITableViewDelegate {
    var tableView: UITableView!
    
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
        
        self.title = "Feed"
        
        self.tableView = UITableView(frame: self.view.bounds, style: .Grouped)
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.view.addSubview(self.tableView)
        self.tableView.autoresizingMask = .FlexibleWidth | .FlexibleHeight
        
        self.tableView.backgroundColor = DiGeoColors.MenuBackgroundColor()
        self.tableView.separatorStyle = .None
        
        self.navigationController?.navigationBar.barTintColor = DiGeoColors.MenuBarTintColor()
        self.navigationController?.navigationBar.titleTextAttributes = [NSForegroundColorAttributeName: DiGeoColors.MenuBarTitleColor()]
        
        self.view.backgroundColor = UIColor.clearColor()
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        self.tableView.reloadSections(NSIndexSet(indexesInRange: NSRange(location: 0, length: self.tableView.numberOfSections() - 1)), withRowAnimation: .None)
    }
    
    override func contentSizeDidChange(size: String) {
        self.tableView.reloadData()
    }
    
    //
    
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
    
    // MARK: - UITableViewDataSource
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 4
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
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
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let CellIdentifier = "Cell"
        
        var cell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier(CellIdentifier) as? UITableViewCell
        
        if cell == nil {
            cell = SideDrawerTableViewCell(style: .Default, reuseIdentifier: CellIdentifier)
            cell.selectionStyle = .Blue
        }
        
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
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
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
    
    func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = SideDrawerSectionHeaderView(frame: CGRect(x: 0, y: 0, width: CGRectGetWidth(tableView.bounds), height: 56.0))
        headerView.autoresizingMask = .FlexibleHeight | .FlexibleWidth
        headerView.title = tableView.dataSource?.tableView?(tableView, titleForHeaderInSection: section)
        return headerView
    }
    
    func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 32
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return 32
    }
    
    func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 0
    }
    
    // MARK: - UITableViewDelegate
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        switch indexPath.section {
        case FeedSection.Filter.rawValue:
            break
        case FeedSection.Global.rawValue:
            break
        case FeedSection.Friends.rawValue:
            break
        case FeedSection.Me.rawValue:
            break
        default:
            break
        }
//        switch indexPath.section {
//        case FeedSection.Filter.rawValue:
//            var cell: UITableViewCell! = tableView.cellForRowAtIndexPath(indexPath)
//            
//            if cell.accessoryType == .Checkmark {
//                cell.accessoryType = .None
//            }
//            else {
//                cell.accessoryType = .Checkmark
//            }
//            break
//        case FeedSection.Feed.rawValue:
//            let center = ExampleCenterTableViewController()
//            let nav = UINavigationController(rootViewController: center)
//            
//            if indexPath.row % 2 == 0 {
//                self.evo_drawerController?.setCenterViewController(nav, withCloseAnimation: true, completion: nil)
//            } else {
//                self.evo_drawerController?.setCenterViewController(nav, withFullCloseAnimation: true, completion: nil)
//            }
//        default:
//            break
//        }
        
        tableView.selectRowAtIndexPath(indexPath, animated: false, scrollPosition: .None)
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }


}
