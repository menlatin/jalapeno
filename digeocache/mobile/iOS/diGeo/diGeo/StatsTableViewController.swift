//
//  StatsTableViewController.swift
//  OrderedDictionary
//
//  Created by Elliott Richerson on 3/6/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import UIKit

class StatsTableViewController: UITableViewController {
    var stats: DiGeoService.Stats = DiGeoService.Stats()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
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
    }
    
}

/* Handle Table View Data Source + Delegate */
extension StatsTableViewController: UITableViewDataSource, UITableViewDelegate {
    
    enum StatsSection: Int {
        case Rank
        case Credit
        case Activity
        case Actions
    }
    
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 4
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
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
    
    override func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
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
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let CellIdentifier = "Cell"
        
        var cell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier(CellIdentifier) as? UITableViewCell
        
        //        if cell == nil {
        //            cell = SideDrawerTableViewCell(style: .Default, reuseIdentifier: CellIdentifier)
        //            cell.selectionStyle = .Blue
        //        }
        
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
    
}