//
//  StatsViewController.swift
//  diGeo
//
//  Created by Elliott Richerson on 3/5/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import UIKit

enum StatsSection: Int {
    case Rank
    case Credit
    case Activity
    case Actions
}

class StatsViewController: ExampleViewController, UITableViewDataSource, UITableViewDelegate {
    
    var tableView: UITableView!
    var stats: DiGeoService.Stats = DiGeoService.Stats()


    override func viewDidLoad() {
        super.viewDidLoad()
        
        //
                
        DiGeoService.stats("Elliott") {
            switch($0) {
            case .Error:
                break
            case .Results(let results):
                self.stats = results
                self.tableView.reloadData()
                break
            }
        }
        
        //
        
        self.title = "Stats"
        
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
    
    // MARK: - UITableViewDataSource
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 4
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case StatsSection.Rank.rawValue:
            return 5
        case StatsSection.Credit.rawValue:
            return 4
        case StatsSection.Activity.rawValue:
            return 1
        case StatsSection.Actions.rawValue:
            return 1
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
        
        switch indexPath.section {
        case StatsSection.Rank.rawValue:
            switch indexPath.row {
            case 0:
                cell.textLabel?.text = "Score: \(self.stats.score)"
                break
            case 1:
                cell.textLabel?.text = "Overall Rank: \(self.stats.overallRank)"
                break
            case 2:
                cell.textLabel?.text = "Friends Rank: \(self.stats.friendsRank)"
                break
            case 3:
                cell.textLabel?.text = "Cache Ratio: \(self.stats.cacheRatio)"
                break
            case 4:
                cell.textLabel?.text = "Wallet Value: \(self.stats.walletValue)"
                break
            default:
                break
            }
            break
        case StatsSection.Credit.rawValue:
            switch indexPath.row {
            case 0:
                cell.textLabel?.text = "Video Credits: \(self.stats.videoCredits)"
                break
            case 1:
                cell.textLabel?.text = "Freeze Credits: \(self.stats.freezeCredits)"
                break
            case 2:
                cell.textLabel?.text = "Easy Drop Credits: \(self.stats.easyDropCredits)"
                break
            case 3:
                cell.textLabel?.text = "Bonus Credits: \(self.stats.bonusCredits)"
                break
            default:
                break
            }
            break
        case StatsSection.Activity.rawValue:
            switch indexPath.row {
            case 0:
                cell.textLabel?.text = "Transaction Count \(self.stats.transactionCount)"
                break
            default:
                break
            }
            break
        case StatsSection.Actions.rawValue:
            switch indexPath.row {
            case 0:
                cell.textLabel?.text = "ACTIONS"
                break
            default:
                break
            }
            break
        default:
            break
        }
        
        return cell
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case StatsSection.Rank.rawValue:
            return "Rank"
        case StatsSection.Credit.rawValue:
            return "Credit"
        case StatsSection.Activity.rawValue:
            return "Activity"
        case StatsSection.Actions.rawValue:
            return "Actions"
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
        case StatsSection.Rank.rawValue:
            NSLog("Did select rank stat")
        case StatsSection.Credit.rawValue:
            NSLog("Did select credit stat")
        case StatsSection.Activity.rawValue:
            NSLog("Did select activity stat")
        case StatsSection.Actions.rawValue:
            NSLog("Did select action in stats")
        default:
            NSLog("Unrecognized stat section selection")
        }
        
        

        
        tableView.selectRowAtIndexPath(indexPath, animated: false, scrollPosition: .None)
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }

}
