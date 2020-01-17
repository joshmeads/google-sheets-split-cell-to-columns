const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Split Cells')
    .addItem('Run on Selected Cell', 'runSplitter')
    .addToUi();
};

export default onOpen;
