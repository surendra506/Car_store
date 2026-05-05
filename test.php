<?php
use Magento\Framework\App\Bootstrap;
require __DIR__ . '/public_html/app/bootstrap.php';
$bootstrap = Bootstrap::create(BP, $_SERVER);
$obj = $bootstrap->getObjectManager();
$pageFactory = $obj->get('Magento\Cms\Model\PageFactory');
$page = $pageFactory->create()->load('home-slider', 'identifier');
echo $page->getContent();
