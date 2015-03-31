//
//  MapViewController.swift
//  diGeo
//
//  Created by Elliott Richerson on 3/6/15.
//  Copyright (c) 2015 Elliott Richerson. All rights reserved.
//

import MapKit

enum CenterViewControllerSection: Int {
    case LeftViewState
    case LeftDrawerAnimation
    case RightViewState
    case RightDrawerAnimation
}

class MapViewController: ExampleViewController, MKMapViewDelegate {//UITableViewDataSource, UITableViewDelegate {
    
    var mapView: MKMapView!
    var leftGestureMarginView: UIView!
    var rightGestureMarginView: UIView!
    
//    var tableView: UI TableView!
    
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: NSBundle?) {
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
        
        self.restorationIdentifier = "MapViewControllerRestorationKey"
    }
    
    override init() {
        super.init()
        
        self.restorationIdentifier = "MapViewControllerRestorationKey"
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = "DiGeoCache"
        
        self.setupNavigationBar()
        self.setupMapAndControls()
        self.setupSideGestureMargins()
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        println("Center will appear")
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        println("Center did appear")
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated)
        println("Center will disappear")
    }
    
    override func viewDidDisappear(animated: Bool) {
        super.viewDidDisappear(animated)
        println("Center did disappear")
    }
    
    func setupLeftMenuButton() {
        let leftDrawerButton = DrawerBarButtonItem(target: self, action: "leftDrawerButtonPress:")
        self.navigationItem.setLeftBarButtonItem(leftDrawerButton, animated: true)
    }
    
    func setupRightMenuButton() {
        let rightDrawerButton = DrawerBarButtonItem(target: self, action: "rightDrawerButtonPress:")
        self.navigationItem.setRightBarButtonItem(rightDrawerButton, animated: true)
    }
    
    func setupNavigationBar() {
        self.setupLeftMenuButton()
        self.setupRightMenuButton()
        
        let barColor = DiGeoColors.MapBarColor()
        self.navigationController?.navigationBar.barTintColor = barColor
        self.navigationController?.view.layer.cornerRadius = 10.0
    }
    
    func setupMapAndControls() {
        // Frame the MKMapView and Controls
        let yOffset: CGFloat = 10 + self.navigationController!.navigationBar.frame.maxY
        let mapViewInset: CGRect = CGRect(x: self.view.bounds.minX, y: yOffset, width: self.view.bounds.width, height: self.view.bounds.height-yOffset-20)
        self.mapView = MKMapView(frame: mapViewInset)
        self.mapView.delegate = self
        self.view.addSubview(self.mapView)
        self.mapView.autoresizingMask = .FlexibleWidth | .FlexibleHeight
    }
    
    func setupSideGestureMargins() {
        // Provide Left/Right UIView Edge Margins to Allow Gesture Interaction with Side Menus
        let menuMarginWidth: CGFloat = 45.0
        let leftGestureMarginRect: CGRect = CGRect(x: self.mapView.bounds.minX, y: self.mapView.bounds.minY, width: menuMarginWidth, height: self.mapView.bounds.height)
        let rightGestureMarginRect: CGRect = CGRect(x: self.mapView.bounds.maxX - menuMarginWidth, y: self.mapView.bounds.minY, width: menuMarginWidth, height: self.mapView.bounds.height)
        
        self.leftGestureMarginView = UIView(frame: leftGestureMarginRect)
        self.rightGestureMarginView = UIView(frame: rightGestureMarginRect)
        self.leftGestureMarginView.backgroundColor = UIColor.clearColor()
        self.rightGestureMarginView.backgroundColor = UIColor.clearColor()
        
        self.mapView.addSubview(self.leftGestureMarginView)
        self.leftGestureMarginView.autoresizingMask = .FlexibleHeight
        self.mapView.addSubview(self.rightGestureMarginView)
        self.rightGestureMarginView.autoresizingMask = .FlexibleHeight
    }
    
    override func contentSizeDidChange(size: String) {
//        self.tableView.reloadData()
    }
    
    // MARK: - Button Handlers
    func leftDrawerButtonPress(sender: AnyObject?) {
        self.evo_drawerController?.toggleDrawerSide(.Left, animated: true, completion: nil)
    }
    
    func rightDrawerButtonPress(sender: AnyObject?) {
        self.evo_drawerController?.toggleDrawerSide(.Right, animated: true, completion: nil)
    }
    
}
